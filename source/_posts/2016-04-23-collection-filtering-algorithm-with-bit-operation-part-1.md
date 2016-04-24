layout: post
title: Collection Filtering Algorithm with Bit Operation - Part.1
date: 2016-04-23 17:46:30
categories:
  - Programming
  - Algorithm
tags:
  - Introduction
  - Bit Operation
  - Binary
  - Logic
  - Algorithm
  - Collection
  - Filtering
  - Bloom Filter
---

## Background

Collection must be the most commonly used data model in programming. And there are a number of data structure that represents collection in memory, in which `Array` and `Liked List` must be the most well known ones.

When dealing with collection, `filtering` must be one of the most widely used operation being used. Such as find item(s) satisfies specific criteria from the collection. Although filtering is used a lot, but it isn't actually a simple or easy operation to apply, especially dealing with tremendous data volume.

In fact, there are a number of derived topics about collection filtering, which is impossible to cover them all in the article. This article will focus on `bit operation`, probably a not widely known but really interesting topic to introduce.

## Problem: Find the missing integer

{% blockquote %}
**Problem**  
Suppose there is a collection of integers `L`.
Name the collection that contains integers from 1 to `N` as `G`
Then `L` contains all the elements of `G` except one number `x`.
Items in `L` are in random order.
Find `x`.
{% endblockquote %}

**TIP: ** This problem be too easy to experienced developers and algorithm hackers. But it is a good opening words to the following 2 problems in this series. Also it reveals the core concept of some other advanced technologies, such as `CRC` or `bloom filter`.

When got this problem, the very intuitive(means do it manually by human being) idea is to compare the elements in `L` and `G`, find each element in `L` and remove it from `G`, then the only left item in `G` is `x`.

Here is the code:

```ruby
# @param Integer[] L
# @param Integer N
# @return Integer x
def find_missing_x(L, N)
  G = [*(1..N)] # Create G with all integers from 1 to N

  L.each { |i| G.delete(i) } # Traverse L, and remove each item in L from G

  return G.last # Return the only rest item from G
end
```

Well this is a work but brute algorithm, which is not efficient in both time and space:

* Instantiate `G` means it has space complexity `N`
* Find and remove `i` from `G` means it has time complexity at `O(N*Log(N))`

Yes, the algorithm can be optimized, with bit operation. In fact the problem can be resolved with time complexity `O(N)` and space complexity `O(1)`.

## `Exclusive-Or` Operation

`Exclusive-Or`(Or `XOR` for short, written as `^` in this article) is a basic bit operation, here is an Venn Diagram explains it:

{% asset_img xor_venn.png "XOR" %}

`XOR` is an important bit operation because it has following interesting features:

1. A ^ B = B ^ A (aka **Commutativity**)
2. (A ^ B) ^ C = A ^ (B ^ C) (aka **Associativity**)
3. A ^ A = 0
4. A ^ 0 = A

Commutativity and Associativity ensure that `XOR` can be used despite of order. The 3rd and 4th feature establishes a critical position for `XOR` in `cryptology` and `encoding`.

## Solution: with `XOR`

By making use of `XOR`, previous problem can ben resolved in a much more graceful way:

* Given `y` is the `xor` result of all items in `G`
* And `z` is the `xor` result of all items in `L`
* Then `x = y ^ z`

```ruby
# @param Integer[] L
# @param Integer N
# @return Integer x
def find_missing_x(L, N)
  x = 0 # Set x to 0, since A ^ 0 = A

  (1..N).each { |i| x ^= i } # Calculate the xor result for G

  L.each { |i| x ^= i } # Keep xor all elements in L

  return x # Return the only rest item from G
end
```

Let's prove it mathematically:
```
Given x' = y ^ z
Then  x' = (n1 ^ n2 ^ n3 ^ ... ^ x ^ ... ^ nN) ^ (n1 ^ n2 ^ n3 ^ ... ^ nN)
Since ^ obeys commutativity and associativity
Then  = (n1 ^ n1) ^ (n2 ^ n2) ^ ... ^ (nN ^ nN) ^ x
As n ^ n = 0 and n ^ 0 = n
Then  x' = 0 ^ 0 ^ ... ^ 0 ^ x
         = x
```

Actually the code can be more concise by using `reduce`, with 2-lines of code

```ruby
# @param Integer[] L
# @param Integer N
# @return Integer x
def find_missing_x(L, N)
  x = (1..N).reduce(&:^) # Calculate the xor result for G

  L.reduce(x, &:^) # Keep xor all elements in L and return
end
```

Or `C` version:
```c
int find_missing_x(long N, long* L) {
  long x = N;

  for(long i = 0; i < N - 1; i++) { // L has size of N-1
    x ^= i ^ L[i];
  }

  return x;
}
```

## Extending problems

So far the problem has been gracefully resolved. But it is yet the end, here is a couple of extending questions:

1. If `G` is collection with random but unique numbers (Not continues integer from 1 to `N`). How to write the code?
2. Based on `1`, if there are 2 numbers are missing? How to find them both?
3. Based on `1`, but `L` contains the members from `G` except `x`for exactly 2 times. That means `L` might contain 0 or 1 `x`, but exactly 2 for any other members from `G`. How to find `x`?
4. Based on `1`, but `G` isn't a collection of integer, but a collection of web urls. How to find the one missing url?
5. Based on `4`, `G` is a collection of url, `L` is subset of `G` (might contains fewer members other than exactly `N` - 1). How can we know a randomly picked member from `G` is absolutely not contained by `L`. Given the tolerance to mistake on saying a member from `G` is in `L` but it doesn't.

These problems will be explained in the following posts.
