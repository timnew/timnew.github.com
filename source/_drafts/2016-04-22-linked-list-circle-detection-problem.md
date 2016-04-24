layout: post
title: Linked List Circle Detection Problem
date: 2016-04-22 20:13:56
categories:
  - Programming
  - Algorithm
tags:
  - algroithm
  - linked list
  - circle
  - detection
  - data structure
---

`Linked List` is a commonly used data structure in programming. It is represented by a group of `node`, which has a `next` pointer points to the following node.

{% graphviz Linked List %}
digraph sample {
  graph [layout = circo]
  node[shape=circle, label=""]

  1 -> 2 -> 3 -> 4;  
}
{% endgraphviz %}

https://leetcode.com/problems/linked-list-cycle/

But due to the flexible nature of `node` representation, 

{% graphviz sample %}
digraph sample {
  graph [layout = circo]
  node[shape=circle, label=""]

  1 -> 2 -> 3 -> 4 -> 5 -> 6;
  6 -> 3;
}
{% endgraphviz %}
