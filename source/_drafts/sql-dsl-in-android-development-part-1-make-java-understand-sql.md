layout: post
title: SQL DSL in Android development  - Part.1 Make Java understand SQL
comments: true
categories:
  - general
tags: []
date: 2013-07-19 08:00:00
---
Android supports Sqlite database for application to manage big dataset. Due to the limitation of Java language, the API isn't as convenient as expected. Even with the help from`SQLiteQueryBuilder` and `DatabaseUtils`, it is still a nightmare to manage complex queries in used in application that heavily depends on database.

Luckily, `SQLiteDatabse` provides the `rawQuery` API to enable developer to access the database with raw sql queries. For better maintanablility, Android application usually store the table names, column names as string constants in the code in practice. As a result, the query need to interpolate these constants between SQL keywords. Here is a sample of the code:

<code>
	public static final String QUERY_LOAD_CITY_BY_CODE = "SELECT " + TABLE_LOCATIONS + "." + ALL_COLUMNS + ","+TABLE_CITY_CODES + "." + COL_CODE +"," + TABLE_SERVICES_STATUS + "." + COL_SERVICE_STATUS
            .from(TABLE_LOCATIONS)
            .join(TABLE_CITY_CODES).on(TABLE_LOCATIONS + "." + COL_ID, TABLE_CITY_CODES + "." + COL_CITY_ID)
            .leftJoin(TABLE_SERVICES_STATUS).on(TABLE_LOCATIONS + "." + COL_ID, TABLE_SERVICES_STATUS + "." + COL_LOCATION_ID)
            .where(equal(TABLE_CITY_CODES + "." + COL_CODE, QUERY_ARG)).toQuery();
</code>