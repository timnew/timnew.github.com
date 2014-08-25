layout: post
title: Use Postgres Multiple Schema Database in Rails
comments: true
categories:
  - Programming
  - Ruby
tags:
  - rails
  - postgres
  - multischema
  - schema
  - database
  - active record
date: 2012-07-17 08:00:00
---
Postgres provided a very interesting feature called "Schema" in addition to other "normal" database features, which provide a extra layer between database and tables. So with schema, you can have tables with same name in one database, if they are in different schemas.
To me schema is not a good idea! I assume "table-space" or even "namespace" could be a better name. In fact, there are a number of people agree that schema is not a good name:
{% blockquote Jerod Santo http://blog.jerodsanto.net/2011/07/building-multi-tenant-rails-apps-with-postgresql-schemas/ %}
"Schema" is such a terrible name for this feature. When most people hear the term "schema" they think of a data definition of some sort. This is not what PostgreSQL schemas are. I'm sure the PostgreSQL devs had their reasons, but I really wish they would have named it more appropriately. "Namespaces" would have been apropos.

Anywho, the easiest way for me to describe PostgreSQL schemas (besides telling you that they are, indeed, namespaces for tables) is to relate them to the UNIX execution path. When you run a UNIX command without specifying its absolute path, your shell will work its way down the $PATH until it finds an executable of the same name.
{% endblockquote %}
And you can find more [here](http://goo.gl/ghj4e)

And there is a popular routine is to use the postgres schema for sub-domains. For example, you're a BSS provider, you rend your BBS apps to different organizations. To the organizations. they want to have its own BBS app instance running independently, the most important is that data should be stored into separated spaces, and could be accessed from its own domain name. But to you, for administration, you want they share the same backend management console.
In this case the best way to solve the problem is to store the data owned by different subsystem into different schemas. But store all the administration data into a single schema or even in public schema.
The same guy Jerod has a [post](http://blog.jerodsanto.net/2011/07/building-multi-tenant-rails-apps-with-postgresql-schemas/) described how to build this kind of system in details. There are a bunch of posts described how to build the system like this, which could be found by [googling](http://goo.gl/HaByF) easily.
And there is even a [ruby gem called apartment](https://github.com/bradrobertson/apartment) from Brad Robertson to support this kind of system

This idea looks fancy, but unless you 10000% certain that the sub-systems will keep its independent status and without any collaboration forever.
Or it sooner or later, you will find the "fancy idea" become a horrible idea.
When time goes by, there could be more and more and more features that required to add collaboration between sub-systems. Such as provide a unified authentication mechanism, so user can logged in once and switch between different systems easily. Or administrator might ask for a unified statistics graph for all sub-systems.
All these requirements are related to cross-schema query! To be honest, cross query in some cases could be painful!
And it brings trouble to all aspects in your system, such as data migration, test data generation, etc.

That's what exactly happens in my current project!
My current project is Rails 3 project, the codebase is brand new but built on a legacy multiple schema postgres database. And for some reason,
we must keep the multiple schema design unchanged. But our goal is to unify the separated subsystem into a more closed-collaborated system.

Since ActiveRecord in Rails doesn't include the native support to this fancy feature. Which means you will met problem during migration, or even preparing test data with factory-girl.

Postgres allows to locate the table in different schemas with full qualified name like this `<schema name>.<table name>.<column name>`. The schema name is optional, when you omitted the schema name, Postgres will search the table in a file-system-path-like order called "[search-path](http://www.postgresql.org/docs/8.1/static/ddl-schemas.html#DDL-SCHEMAS-PUBLIC)".

And you can set and query current search path with Postgres SQL statements:

{% codeblock Query and Set search_path  lang:sql %}
SHOW search_path;

SET search_path TO <new_search_path>;
{% endcodeblock %}

Since ActiveRecord won't add the full qualified schema name in front of the table name when it translate the ARel into SQL statements. So we can only support the multiple schema database with the search_path.

Basically, it is a very natural idea that you can use the following ruby code to make ActiveRecord make query on different schemas:

{% codeblock Select Schema lang:ruby %}

def add_schema_to_search_path(schema)
  ActiveRecord::Base.connection.execute "SET search_path TO #{schema}, public;"
end

def restore_search_path
  ActiveRecord::Base.connection.execute "SET search_path TO public;"
end

{% endcodeblock %}

This two methods work perfect when querying things from the database. But sooner or later, you will run into big trouble when you try to write data into database.

In db migration or use factory_girl to generate test fixtures, you might found that the data you insert in different schemas finally goes into **the first non-public schema**. But all the query still works perfect!

We found this problem occurs when the following conditions are satisfied:

1. Query are happened in a Transaction.
2. You insert data into multiple non-public schemas.
3. You user `SET search_path TO` SQL statement to switch between schema rather than explicitly using full-qualified table name.

And the most interesting thing is that:

1. All the `SELECT` queries are executed on schemas correctly
2. If you use `SHOW search_path;` to query current search path, you will got correct search path value.
3. All data are inserted into first `non-public` schema that you actually wrote data into. So which means it you try to insert data into public schema, it won't go wrong. Or you switched to a non-public schema, but actually you doesn't insert any rows, it also won't be impacted.

To solve this problem, I spent 2 nights and 2 days to digged into the source code of ActiveRecord gem and pg gem (the Postgres database adapter).
And finally I solved the problem by using the attribute on PostgreSQLAdapter.

Basically, instead of using the SQL query, you should use the `PostgreSQLAdapter#schema_search_path` and `PostgreSQLAdapter#schema_search_path=` to get and set the search path.
And if you dig into the source code, you will find the two methods does the exact same thing as we did except it assigned one more instance variable `@schema_search_path`.

{% codeblock methods on PostgreSQLAdapter lang:ruby %}

# Sets the schema search path to a string of comma-separated schema names.
# Names beginning with $ have to be quoted (e.g. $user => '$user').
# See: http://www.postgresql.org/docs/current/static/ddl-schemas.html
#
# This should be not be called manually but set in database.yml.
def schema_search_path=(schema_csv)
  if schema_csv
    execute("SET search_path TO #{schema_csv}", 'SCHEMA')
    @schema_search_path = schema_csv
  end
end

# Returns the active schema search path.
def schema_search_path
  @schema_search_path ||= query('SHOW search_path', 'SCHEMA')[0][0]
end

{% endcodeblock %}

The most interesting thing is if you search the reference to `@schema_search_path`, you will find it is only used as a local cache of current search_path in the adapter, and it is initialized with the value from the query `SHOW search_path;` if it is nil, and then keep the value as the cache!
This implementation is buggy and caused the problems described before!

If we use the SQL query to set the search path rather than calling `schema_search_path=`, we won't set the `@schema_search_path` at sametime, ideally this value will remain nil by default. Then transaction or other object in ActiveRecord call `schema_search_path` to get current search path. The first time, the variable `@@schema_search_path` is nil, and will be initialized by the value from query `SHOW search_path;` and then won't changed any more, since in the future this query won't be executed any longer.
As a result, the schema will be switched successfully for the first time, but failed in the following.

Which means at current stage, if you want to change search_path, the only correct way is to use `PostgreSQLAdapter#schema_search_path=`, and PLEASE PLEASE ignore the warning `"This should be not be called manually but set in database.yml."` in the source code! It is really a misleading message!

I understand current implementation is for performance consideration, but caching the value is absolutely not a good idea when you cannot keep things in sync and the sync is critical in some cases.
I'm planning to fix this issue in rails codebase and create a pull request to rails maintainer. Wish they could accept this fix. Or at least they should change the warning message.

And besides of using the out-dated and mysterious PgTools mentioned in a lot of posts (I saw a lot of people mentioned this class, but I cannot find it anywhere even I from google or github. It is really a mystery). I create a new utility module called MultiSchema.

{% gist 3129392 %}

You can use it as the utility class in the old-fashioned way:

{% codeblock Procedure usage lang:ruby %}
MultiSchema.with_in_schemas :except => :public do
  # Play around the data in one schema
end
{% endcodeblock %}

Or you can use it in a DSL-like way:

{% codeblock DSL usage lang:ruby %}
class SomeMigration < ActiveRecord::Migration
include MultiSchema

  def change
    with_in_schemas :except => :public do
      # Play around the data in one schema
    end
  end
end
{% endcodeblock %}

`with_in_schemas` method accept both `symbol` and `string`, and you can pass single value, array or hash to it.

* `with_in_schemas` yield all user schemas in the database
* `with_in_schemas :only => %w(schema1 schema2)` populates all given schemas.
* `with_in_schemas :except => %w(schema1 schema2)` populates all except given schemas.
* `with_in_schemas :except => [:public]` is equivalent to `with_in_schemas :except => ['public']`
* `with_in_schemas :only => [:public]` is equivalent to `with_in_schemas :only => :public` and equivalent to `with_in_schemas :public`
* `with_in_schemas :except => [:public]` is equivalent to `with_in_schemas :except => :public`
