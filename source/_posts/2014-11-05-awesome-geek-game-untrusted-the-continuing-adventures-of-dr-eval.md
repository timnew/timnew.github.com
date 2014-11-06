layout: post
title: Awesome geek game Untrusted - the Continuing Adventures of Dr. Eval
date: 2014-11-05 22:21:40
updated: 2014-11-06 15:05:00
categories:
  - Game
  - Programming Game
tags:
  - Programming Game
  - Untrusted
  - Javascript
  - Walkthrough
---

[Untrusted] is an awesome game brought to us by [Alex Nisnevich] and [Greg Shuflin]. `Untrusted` is an unique puzzle game designed for geeks and developers. The reason I said it is designed for geeks and developer is because to solve the puzzles in the game, you need to know or even to write some `javascript`.

Here is how the creators describe their baby:

{% blockquote Untrusted Repo https://github.com/AlexNisnevich/untrusted %}

Untrusted —or— the Continuing Adventures of Dr. Eval is an exciting Meta-Javascript Adventure Game wherein you guide the dashing, steadfast Dr. Eval through a mysterious MACHINE CONTINUUM, wherein, using only his trusty computer and the TURING-COMPLETE power of Javascript, he must literally ALTER HIS REALITY in order to find his freedom! You must literally edit and re-execute the very Javascript running the game in your browser to save Dr. Eval from this dark and confusing reality!

{% endblockquote %}

The description is a little bit hard to understand if you don't touch the game. I'll try to translate it a little bit:

In the game, to clear a level, you need to move your `avatar` to the exit. And just like other normal acarde game, you can control the your `avatar`, Dr. Eval using `arrow keys`. The intresting part of this game is that basically, you will always run into the a dead end if you just move Dr.Eval around without doing anything else. Luckily, you will be able to access the source code that creates the world and the rule in the world. To save yourself from the dead end, you need to change part the world/rule by hacking the source code.

The game isn't that hard if you have some coding experience and is familiar with javascript concepts. And learn from the passed level is very important, since you might find either useful hints or even code to solve your current problem.

**NOTE** Besides the puzzle and the code, the music of each level is also great! 8Bit music in different style! Really awesome!
## Hints and Walkthrough

Insterested? Click here to play the game: [Untrusted]

## Hints and Walkthrough

I attached my hints and solutions below, is case if you run into trouble.

### Level 1: cellBlockA

Well, you are trapped in a box. And you need to move yourself to the exit (blue squre).

1. Before you can do anything, you need to pick the computer first, then you will be access to the source code interface.
2. Once you got the computer, you can figure out the code that generates the walls.
3. Remove the code that generate the wall! And press `Ctrl+5` to apply it.
4. {% gist e2c2ea766f6163ccfcb6 %}

### Level 2: theLongWayOut

Well, you have learn the trick from Level 1, but it doesn't work anylonger this time. You need to figure out a new apporach.

1. Don't try to find a path in the maze, there is no such solution.
2. You cannot change the maze created, but you can do something to it before it is deployed.
3. You have learn how to create it for specific size. Why not create another smaller one that doesn't trouble you?!
4. A maze with size (0,0) is not possible, try a more realistic one, such as (3, 3) or (4, 4).
5. Exit is blocked completely. Do think about to break the wall, that is impossible.
6. Who said there can be only 1 exit per level?!
7. Create a new exit at a different location! You can learn the code form existing one.
8. {% gist 59ff5de31063dd27ce9d %}

### Level 3: validationEngaged

Well, again, `validateLevel` is introduced, which prevents you to replay the old tricks. So you cannot create or remove objects on the fly this time.

1. Since you cannot create or remove objects this time, but you still can move objects.
2. Move one of the wall away to make a gap between the wall.
3. {% gist a51ca90e78c392b453ae %}

### Level 4: multiplicity

You cannot move wall this time, what will you do?

1. Well, this is just a mindset trap. Forget about moving stuff aroud.
2. There is no `validateLevel` in this level.
3. What you did in level 2.
4. Just create a exit in the box.
5. {% gist 59c9d0f95aa2dabd303f %}

### Level 5: minesweeper

Remember the favous game in Windows? Try it here.

1. The issue here is that the mine cannot be distinguished.
2. Mark the mine with a color other than red.
3. You can change block block color by call `setSquareColor`.
3. {% gist 14cd0090ffe945cf7b54 %}

### Level 6: drones101

A killing drone? Keep away from it.

1. Well, check `moveToward`, the logic is actually very dumb.
2. It always, move `up` and `down` if the x offset is larger than y offset.
3. It will not move, it the intented direction is blocked.
4. {% gist d3c146559b8c3d7d0f41 %}
5. Move right first, then move down when you at the same col as the drone and block. Then move right, the drone will not follow you.

### Level 7: colors

A phone to make call? Great idea!

1. Pick up the phone, then press `q`
2. The callback will be executed everytime you pressed `q`
3. Rotate your color in the callback
4. {% gist 47bd1335906094d412aa %}

### Level 8: intoTheWoods

Go across the forest from the left to the right!
In this level, there is very little code that you can change!

1. Press `q`
2. The only code you can change is the callback function name
3. All the functions that you can call are in the `functionList`
4. Generate a new forest, when you press `q`
5. {% gist 663f51f6cf02891a0b4a %}
6. Move right as far as you can; Once you are blocked, press `q` to generate a new forest, the move.
7. Repeat move and generate forest untill you reach the exit.

### Level 9: fordingTheRiver

Well, a self driven raft, the raft comes to pick you up.
BTW, I really love the BG music of this level.

1. The raft direction is stored in variable `raftDirection`.
2. Change the `raftDirection` to `up`, will make the raft move up each turn.
3. Find a chance to override the value of `raftDirection`.
4. Write a function that registerd as phone call back with API `setPhoneCallback`
5. {% gist 584529348a4010ef6512 %}
6. Go to the raft, after boarding the raft press `q` to execute callback, then move up.

### To be continued

Laptop is running out of battery, I'll keep updating this blog tomorrow.

[Untrusted]: http://alexnisnevich.github.io/untrusted/
[Alex Nisnevich]: http://alex.nisnevich.com/portfolio/
[Greg Shuflin]: http://github.everydayimshuflin.com/


<script src="//code.jquery.com/jquery-2.1.1.min.js"></script>
<script>
$(function(){
  var $root = $('.article-entry');
  $root.find('ol li').css('display', 'none');
  $root.find('ol').each(function(){
    var $ol = $(this);
    $('<li><a href="#">Hint me</a></li>').click(function(e){
      e.preventDefault();
      $ol.find('li:hidden:first').css('display', 'list-item')
      if($ol.find('li:hidden').length === 0) {
        $(this).remove();
      }
    }).appendTo($ol);
  });
});
</script>
