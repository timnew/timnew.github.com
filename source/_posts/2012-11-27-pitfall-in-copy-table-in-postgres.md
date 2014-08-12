---
layout: post
title: "Pitfall in copy table in Postgres"
description: ""
date: 2012-11-27 15:41
comments: true
categories: 
category: postgres
tags: [postgres sequence id]
sharing: true
footer: false
---

We countered a very wield runtime error today, after migrated some data from a legacy database.

Because there is no change on the models, so we just create the table, and copied the data from the legacy database directly.
To ensure the migration doesn't break anything, we also wrote some migration test to verify the data integrality. And we found all tests are passed.

Everything looks perfect until the app goes live. We found the app crashes occasionally when we're trying to create new data record in the system.
Sometimes it works fine, but sometimes we got an error says "duplicate key value violates unique constraint 'xxxxx_pkey'".

It is wield because we're really confident about our unit test and migration test. The problem must not related to migration and logic.

After some manually tests, we found we also got error when create entry with raw SQL Insert Query. So it seems to be a postgres issue.  
And the problem is caused because of the primary key, which is a auto-generated id.

Postgres introduces the `Sequence` to generate the auto-increase index. Sequence remember the last index number it generated, and calculate the new index by +1.  
During the data migration, we copy the data rows from another table to a new table. To keep the relationship between records, we also copied the primary key in the row. As a result, although we had inserted a number of records into the table, but the sequence binding to the primary key doesn't been updated. 

For example, we have inserted the following 3 entries:

* { id: 1, name: 'Jack' }
* { id: 2, name: 'Rose' }
* { id: 4, name: 'Hook' }

But because the id is also inserted, so the sequence is still at 1, so when we execute the following SQL: `

{% codeblock Insert entry lang:sql %}

INSERT INTO users (name)
VALUES ('Robinhood');

{% endcodeblock %}

And sequence will generate 1 as the id, which is conflicted with entry `{ id: 1, name: 'Jack' }`, and then database yield exception "duplicated key".
But usually the id is not continues because of deletion of the records, which looks like there are "holes" in the records. So our app can successfully insert entry successfully when new entry falls into the "hole".

To solve this problem, we need to also update the sequences in the table, including the primary sequence. Postgres allow `Sequence` to be updated by using `ALTER SEQUENCE` command, and we can set the sequence to a big enough integer:

{% codeblock Update Sequence lang:js%}

ALTER SEQUENCE users_id_seq RESTART 10000

{% endcodeblock %}

A smarter way is to query the whole table to find out the maximum id number, and set the sequence to that number + 1.
