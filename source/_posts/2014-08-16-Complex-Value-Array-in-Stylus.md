layout: post
title: Complex Value Array in Stylus
comments: true
tags:
  - stylus
  - array
  - box-shadow
  - css
  - pitfall
  - workaround
  - hash
date: 2014-08-16 23:32:38
categories:
  - Programming
  - Stylus
---

[Stylus] is an awesome CSS pre-processor, which provides much more concise syntax and more powerful feature than its competitors, such as [LESS] or [SCSS].

But now, with more and more features added into `Stylus`, it seems its syntax become over-weighted. Pitfall come up.

I wish to declare an array of values for `box-shadow` property. And I can reference them with index:

```stylus
drop-shadows = [
  0 2px 10px 0 rgba(0, 0, 0, 0.16),
  0 6px 20px 0 rgba(0, 0, 0, 0.19),
  0 17px 50px 0 rgba(0, 0, 0, 0.19),
  0 25px 55px 0 rgba(0, 0, 0, 0.21),
  0 40px 77px 0 rgba(0, 0, 0, 0.22)
]

drop-shadow(n)
  box-shadow shadows[n]

for i in (1..5)  
  .drop-shadow-{i}
    drop-shadow(i)
```

And expect it generates

```css
.drop-shadow-1 {
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.16);
}  
.drop-shadow-2 {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}  
.drop-shadow-3 {
  box-shadow: 0 17px 50px 0 rgba(0, 0, 0, 0.19);
}  
.drop-shadow-4 {
  box-shadow: 0 25px 55px 0 rgba(0, 0, 0, 0.21);
}  
.drop-shadow-5 {
  box-shadow: 0 40px 77px 0 rgba(0, 0, 0, 0.22;
}
```

<del>But I found there is not such thing called `Array` in `Stylus`!!!!<del>
There is only `Hash`, and Hash doesn't accept number as key!
So finally, I come up something like this:

```stylus
drop-shadows = {
  '1': 0 2px 10px 0 rgba(0, 0, 0, 0.16),
  '2': 0 6px 20px 0 rgba(0, 0, 0, 0.19),
  '3': 0 17px 50px 0 rgba(0, 0, 0, 0.19),
  '4': 0 25px 55px 0 rgba(0, 0, 0, 0.21),
  '5': 0 40px 77px 0 rgba(0, 0, 0, 0.22)
}

drop-shadow(n)
  box-shadow shadows[n+'']

for i in (1..5)  
  .drop-shadow-{i}
    drop-shadow(i)
```

In this piece of code, there are a bunch of pitfalls:

1. Hash doesn't accept number as key. So `1: 0 2px 10px 0 rgba(0, 0, 0, 0.16)` cause compile error.
2. `'1' != 1`, so `drop-shadows[1]` returns `null`
3. There is no type conversion function in `Stylus`, use the same trick as `JavaScript`. `''+n` convert `n` into `string`.

------

Just found `Stylus` provides something called `List`, which is pretty much similar to what array in other languages, except the syntax.

```stylus
drop-shadows = 0 2px 10px 0 rgba(0, 0, 0, 0.16),
               0 6px 20px 0 rgba(0, 0, 0, 0.19),
               0 17px 50px 0 rgba(0, 0, 0, 0.19),
               0 25px 55px 0 rgba(0, 0, 0, 0.21),
               0 40px 77px 0 rgba(0, 0, 0, 0.22)


drop-shadow(n)
  box-shadow shadows[n]

for i in (1..5)  
  .drop-shadow-{i}
    drop-shadow(i)
```

So no brackets or parentesis needed.

[Stylus]: http://learnboost.github.io/stylus/
[LESS]: http://lesscss.org/
[SCSS]: http://sass-lang.com/
[Array in Stylus]: https://github.com/LearnBoost/stylus/issues/1305
