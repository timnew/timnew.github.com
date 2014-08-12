---
layout: post
title: "Implement sqrt with basic algebra operators"
description: ""
date: 2013-01-30 00:11
comments: true
categories: 
category: algorithm
tags: [algorithm,facebook,sqrt,"binary search"]
sharing: true
footer: false
---

It is a very basic question, but to solve it in a time limited environment, require solid knowledge about algorithm, and could use these knowledges flexibly.  
I found the problem of myself is that I know it, but I cannot use it as flexible as my hand.

### The problem description:

> Calculate the square root of a given number N  
> The N could be a decimal, such as 6.25 or 0.01  
> The implementation only allow to use basic algebra operators like +, -, *, /, <, >, etc.  
> Advanced functions like Math.sqrt is not allowed

As a TDDer, I'm used to write a simple test structure that is gonna used to express the test cases:

{% codeblock Code Skeleton lang:rb %}

def assert(expected, actual)
  if expected == actual
    puts "Passed"
  else
    puts "Failed"
    p expected
    p actual
  end
end

def sqrt(n)
end

{% endcodeblock %}

After this, we can begin to write our 1st test case, which is the simplest scenario that I can imagine:  
We assume:

1. n must be an integer
2. n must have a integer square root

{% codeblock 1st test case lang:rb %}

def assert(expected, actual)
  if expected == actual
    puts "Passed"
  else
    puts "Failed"
    p expected
    p actual
  end
end

def sqrt(n) 
end 

# Start from the easiest case, the integer square root.
assert 3, sqrt(9)

{% endcodeblock %}

Run the code, if everything goes right, we will get a failed message as expected. Then we gonna introduce our first implementation to fix the failed test case:

With the 2 additional assumptions in 1st test case, we can easily figure out a simple solution: Simply linear search the integers between the root between 1 and n. 

{% codeblock 1st implementation lang:rb %}

def assert(expected, actual)
  if expected == actual
    puts "Passed"
  else
    puts "Failed"
    p expected
    p actual
  end
end

def sqrt(n) 
  (1..n).each do |x|
    return x if x * x == n
  end
end 

# Start from the easiest case, the integer square root.
assert 3, sqrt(9)

{% endcodeblock %}

So far so good. But there are 2 magic integers that related to the sqrt, one is 1 and another is 0.  
And it seems our function cannot handle all of them correctly, so I wanna improve my algorithm to enable it deals with special numbers: 0, 1.  
So I added 2 test cases, and improved the implementation:

{% codeblock sqrt of 0 and 1 lang:rb %}

def assert(expected, actual)
  if expected == actual
    puts "Passed"
  else
    puts "Failed"
    p expected
    p actual
  end
end

def sqrt(n) 
  return 0 if n == 0
  (1..n).each do |x|
    return x if x * x == n
  end
end 

# Start from the easiest case, the integer square root.
assert 3, sqrt(9)

# 2 corner cases
assert 1, sqrt(1)
assert 0, sqrt(0)

{% endcodeblock %}

Now everything looks good, except the performance.  
The time complexity of this algorithm is O(n), which is bad. I expected the algorithm complexity could close to O(1). At least it should be O(log n)

How could we improve the performance?  
I had ever thought that it is safe to shrink the range to (1..2/n), but in fact it doesn't really help to improve the performance of this algorithm, it is still O(n) after the update.  
And it causes problems when dealing with the number 1, so I prefers to keep it as is.

So what we did in the sqrt function now it kind of a search, we search the number match the condition between 1 and n.  
Obviously that 1..n is a ascending series, and mapping x -> x*x has positive differential coefficient.  
So it is possible for use to use variant binary search replace the linear search, which reduce the time complexity from O(n) to O(log n)

{% codeblock Binary Search lang:rb %}

def assert(expected, actual)
  if expected == actual
    puts "Passed"
  else
    puts "Failed"
    p expected
    p actual
  end
end

def binary_search(goal, start, stop)
  mid = (stop - start) / 2 + start
  
  mid_square = mid * mid 
 
  if mid_square == goal
    return mid
  elsif mid_square > goal
    return binary_search(goal, start, mid)
  else
    return binary_search(goal, mid, stop)
  end      
end

def sqrt(n) 
  return 0 if n == 0

  binary_search(n, 1, n)
end 

# Start from the easiest case, the integer square root.
assert 3, sqrt(9)

# 2 corner cases
assert 1, sqrt(1)
assert 0, sqrt(0)

# 2 normal cases
assert 5, sqrt(25)
assert 9, sqrt(81)

{% endcodeblock %}

After implemented the binary search algorithm, we found a very interesting phenomenon: We didn't restrict n to integer, and it seems it get some capability to dealing with float number?!  
So I tried to add 2 float number test cases:

{% codeblock Float number test cases lang:rb %}

def assert(expected, actual)
  if expected == actual
    puts "Passed"
  else
    puts "Failed"
    p expected
    p actual
  end
end

def binary_search(goal, start, stop)
  mid = (stop - start) / 2 + start
  
  mid_square = mid * mid 
 
  if mid_square == goal
    return mid
  elsif mid_square > goal
    return binary_search(goal, start, mid)
  else
    return binary_search(goal, mid, stop)
  end      
end

def sqrt(n) 
  return 0 if n == 0

  binary_search(n, 1, n)
end 

# Start from the easiest case, the integer square root.
assert 3, sqrt(9)

# 2 corner cases
assert 1, sqrt(1)
assert 0, sqrt(0)

# 2 normal cases
assert 5, sqrt(25)
assert 9, sqrt(81)

# float number
assert 2.5, sqrt(6.25)
assert 1.5, sqrt(2.25)

{% endcodeblock %}

Amazing, our code works fine!  
But I believe it is tricky, since both 2.5 and 1.5 is the number stand on the right center between 2 near-by integers. And it fails dealing with generic float number.  
The problem we met is call stack overflow. Binary search algorithm failed to hit the exactly accurate number that we expected.  
To solve the problem, we can use a small enough range to replace the accurate equality comparison.  
We introduce a const EPSILON to describe the accuracy of the calculation.

{% codeblock Adjust precision lang:rb %}

EPSILON = 100 * Float.const_get(:EPSILON)

def assert(expected, actual)
  if (expected - actual) < EPSILON
    puts "Passed"
  else
    puts "Failed"
    p expected
    p actual
  end
end

def binary_search(goal, start, stop)
  mid = (stop - start) / 2 + start
  
  mid_square = mid * mid 
 
  if (mid_square - goal).abs < EPSILON
    return mid
  elsif mid_square > goal
    return binary_search(goal, start, mid)
  else
    return binary_search(goal, mid, stop)
  end      
end

def sqrt(n) 
  return 0 if n == 0

  binary_search(n, 1, n)
end 

# Start from the easiest case, the integer square root.
assert 3, sqrt(9)

# 2 corner cases
assert 1, sqrt(1)
assert 0, sqrt(0)

# 2 normal cases
assert 5, sqrt(25)
assert 9, sqrt(81)

# float number
assert 2.5, sqrt(6.25)
assert 1.5, sqrt(2.25)

# float numbers not at 2^n
assert 3.3, sqrt(10.89)
assert 7.7, sqrt(59.29)

{% endcodeblock %}  

Now it looks our code can calculate the square root of most of the numbers that larger than 1. But it fails to calculate the square root of number less than 1.  
The reason of the failure is because x * x < x when x < 1 but x * x > 1 when x > 1, which means we should search in different range for the numbers > 1 and numbers < 1.

{% codeblock float numbers < 1  lang:rb %}

EPSILON = 100 * Float.const_get(:EPSILON)

def assert(expected, actual)
  if (expected - actual).abs < (EPSILON * 10)
    puts "Passed"
  else
    puts "Failed"
    p expected
    p actual
  end
end

def binary_search(goal, start, stop)
  mid = (stop - start) / 2 + start
  
  mid_square = mid * mid 
 
  if (mid_square - goal).abs < EPSILON
    return mid
  elsif mid_square > goal
    return binary_search(goal, start, mid)
  else
    return binary_search(goal, mid, stop)
  end      
end

def sqrt(n) 
  return 0 if n == 0

  if n == 1
    return 1
  elsif n > 1
    return binary_search(n, 1, n)
  else
    return binary_search(n, n, 1)
  end
end 

puts "Start from the easiest case, the integer square root."
assert 3, sqrt(9)

puts "2 corner cases"
assert 1, sqrt(1)
assert 0, sqrt(0)

puts "2 normal cases"
assert 5, sqrt(25)
assert 9, sqrt(81)

puts "float number"
assert 2.5, sqrt(6.25)
assert 1.5, sqrt(2.25)

puts "float numbers not at 2^n"
assert 3.3, sqrt(10.89)
assert 7.7, sqrt(59.29)

puts "float number < 1"
assert 0.1, sqrt(0.01)
assert 0.02, sqrt(0.0004)

{% endcodeblock %}

So now the algorithm is pretty much as what we want, but we still found it raise call stack overflow exception sometimes. And it wastes too much iterations on unnecessary precision.  
So I think maybe we can make the algorithm unlimitedly close to O(1) by sacrificing some precision of the result.  
So we set up a limit for the maximum iterations that we can take during the calculation. When the limit is reached, we break out the iteration, and return a less accurate number.

It is really useful when calculating the irrational square root, which is has unlimited digits, and there is no accurate solution to it.

{% codeblock irrational square root lang:rb %}

EPSILON = 10 * Float.const_get(:EPSILON)

DEPTH_LIMIT = 100

def assert(expected, actual)
  if (expected - actual).abs < (EPSILON * 10)
    puts "Passed"
  else
    puts "Failed"
    p expected
    p actual
  end
end

def binary_search(goal, start, stop, depth)
  mid = (stop - start) / 2 + start
  
  mid_square = mid * mid 
 
  if (mid_square - goal).abs < EPSILON
    return mid
  else
    return mid if depth >= DEPTH_LIMIT
    
    if mid_square > goal
      return binary_search(goal, start, mid, depth + 1)
    else
      return binary_search(goal, mid, stop, depth + 1)
    end
  end      
end

def sqrt(n) 
  return 0 if n == 0

  n = n.to_f
  
  if n == 1
    return 1
  elsif n > 1
    return binary_search(n, 1, n, 0)
  else
    return binary_search(n, n, 1, 0)
  end
end 

puts "Start from the easiest case, the integer square root."
assert 3, sqrt(9)

puts "2 corner cases"
assert 1, sqrt(1)
assert 0, sqrt(0)

puts "2 normal cases"
assert 5, sqrt(25)
assert 9, sqrt(81)

puts "float number"
assert 2.5, sqrt(6.25)
assert 1.5, sqrt(2.25)

puts "float numbers not at 2^n"
assert 3.3, sqrt(10.89)
assert 7.7, sqrt(59.29)

puts "float number < 1"
assert 0.1, sqrt(0.01)
assert 0.02, sqrt(0.0004)

puts "irrational root"
assert 1.414213562373095, sqrt(2)
assert 1.732050807568877, sqrt(3)

{% endcodeblock %}

So besides of the binary search approach,  we can calculate the square root with Newton's method, which calculates the result with a iterative equation.  
Newton's method has the limitation in precision, but has a good performance. It is said that one of the ancestors of FPS game Quake uses it in the game engine to get a good performance with limited computing power.
Here is a [easy-understood document](http://www.school-for-champions.com/algebra/square_root_approx.htm) explain how it works.
