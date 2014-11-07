layout: post
title: "Walkthrough: Untrusted - the Continuing Adventures of Dr. Eval"
date: 2014-11-07 23:38:08
categories:
  - Game
  - Programming Game
tags:
  - Programming Game
  - Untrusted
  - Javascript
  - Walkthrough
---

This post is Walkthrough to the game [Untrusted]
The game introduction is available here: [Awesome geek game Untrusted]

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

### Level 10: ambush

Well, this time, there are a dozen of drones are on your way. You need to figure out a possible to get rid of them as fast as you can.

1. Don't try to run away as what you did in Level 6. It is a different scenario.
2. Try to change the drone behavior.
3. To apply the same logic to 3 kinds of drones might not be a good idea.
4. Move attak drones away from the row you're in.
5. Move the Defence Drones away from the row you're in.
6. Ask Reinforcement Drones to stay at the place.
7. {% gist 8f7358d7f81792eecb2d %}

### Level 11: robot

This time, there is very little thing about you. It is about the robot.

1. "Hit and turn" should be smart enough for the puzzle.
2. Move forward, when hit something, turn 90 deg.
3. Use `me.canMove` to test the hit.
4. Since there just 2 states, a boolean should be enough to represent the state.
4. {% gist 4820d49d07688a4d5e08 %}

### Level 12: robotNav

Well this time, it goes a little complicate.

1. "Hit and turn" won't work here.
2. Path seeking algorithm is way too complicate for this puzzle.
3. Robot should be able to be "programmed".
4. An instruction system should be enough for the puzzle.
5. Preset the instruction to the robot, and ask robot to execute it step by step.
6. {% gist ed9e09f7f630b745dc02 %}

### Level 13: robotMaze

Well, Well, Well, it upgraded again. More intelligence is needed.

1. Maze is randomly generated, so fixed instruction sequence won't work any longer.
2. Again, Path seeking algorithm is way too complicate for this puzzle.
3. Don't waste your intelligence.
4. A lot of robot can be "controlled" remotely.
5. Try to teach the robot how to move by your character's movement.
6. {% gist 76a8c8dd62310ccb1cd3 %}
7. The robot move down when you're in last row; the robot move up when you're in the last 3rd row; the robot try to move to your col when you're in the last 2nd row.
8. Move into last 2nd row, and the move to most left. Move left and right to control robot move horizontally. Move to last 3rd row or last row when you need to tell robot move up and down.
9. Stay in last row and last 3rd row, and press 'r' will move robot up and down continuously.

### Level 14: crispsContest

Again another maze!

1. The maze is unsolvable, don't try to solve it.
2. Divide the maze into 5 regions, top left 2 rooms, top right 2 rooms, left 1 room, right 1 room, and bottom 2 rooms.
3. You can hold only one key for each color, or the key will be wasted
4. Because of restriction(hint.3), left and right regions are meaningless.
5. Region top left, top right, and bottom, enter and exists direction doesn't matter.
6. Check carefully, a string in the code isn't locked.
7. The item will be taken away is editable when you pass `greenLock`.
8. Computer and phone are important items for your further plan.
9. `null` or undeclared value causes exception.
10. Exception will break the code execution, which blocks you from passing the door.
11. Try to find something exists, but you don't have yet.
12. `The Algorithm` ?
13. {% gist 0581159360391ecd6386 %}

### Level 15: exceptionalCrossing

Really a cruel design... Pick how to die? Tricky but interesting!

1. The only thing you can change it the value passed to `player.killBy()`.
2. Try to remember what you encounter in last level.
3. Get some hint from the name of this level.
4. Exception breaks code execution.
5. `null` is a valid value.
6. Undeclared value causes exception.
7. {% gist 274c06bf1ce471e98972 %}

### Level 16: lasers

Lazer kills different races.

**NOTICE** You might got killed by lazer when you haven't actually touched it. The reason is that the line isn't 100% align with the coord is given. And I think it is a **BUG** than designed by purpose.

1. Lazer representation and collision detection are separated.
2. Remove the drawing logic won't solve the issue.
3. Lazer only kills the object with different color than itself.
3. Color the lines with the lazer color.
4. Use the phone to update your color.
5. {% gist 8742a1d05da744f52fa1 %}

### Level 17: pointers

This must be the most problematic level in the game!!!!
Since fortune is more important than wisdom in this level!
If you're lucky enough, you might able to clear the level by entering a randomly picked portal.
Actually when I play this level for 1st time, I passed without dohing any code work.

1. Well, you can do nothing to the layout, and teleporter links.
2. A path seeking algorithm won't be helpful for this puzzle.
3. Not all the layout is solvable. That's why you need some fortune!
4. You'll be killed immediately if the teleporter is linked to a trap.
5. Try to figure out all the safe links, whose 2 end-points are teleporters.
6. Try to visualize the the safe links.
7. Check API document for new available APIs.
8. Use `map.getCanvasCoords` to figure out the plot coords for teleporters.
9. Draw lines between safe teleporters.
10. Line drawing code can be found in previous level.
11. {% gist d5a34b58f979991195c0 %}
12. Restart the level, if the level is obviously not solvable.
13. The puzzle is unsolvable, if there is no link to the room where exit locates
14. The puzzle is unsolvable, if there is no link to the room player is placed.
15. Luck is the key!

### Level 18: superDrEvalBros

Great honor to `Super Bro.Mario` {% emoji trophy %}

1. `Jump` is kind of misleading word.
2. "Bridge" should be a better solution.
3. To material builds the bridge is not necessarily to be "block".
4. Create your material.
5. {% gist 510eb8288e8df8cd6d53 %}

**HINT** If you really like to jump:
1. `Jump` is possible, but not a really good solution, since it introduces `races` between 2 timers.
2. {% gist c2eb267825c105774482 %}

### Level 19: documentObjectMadness

jQuery!!!!

1. Code isn't editable at all in this level.
2. Use the `arrow keys` to navigate the green block.
3. You need to use green block to cover the red block.
4. If you familiar with `EverNote Web Clipper`, then it should be very easy for you.
5. Press `up` for 4 times, then `right` 2 times, and adjust your green block to cover `red`

### Level 20: bossFight

Finally, fight against the BOSS!

1. To clear the level, you need to kill all the bosses to get the Algorithm first.
2. Timer is not available.
3. So before you can do anything, you need the phone to trigger something.
4. Only 1 block is available
5. You can place the only block in the middle of the gap to shelter the bullet for you. With its help, it isn't that hard to get the phone without being shot.
6. Or You might create a new tile to shelter the bullets for you, the number of new material blocks are not limited.
7. To kill the `Boss`, you need create your own bullet!
8. If you create your own shelter material, you can make it `passable for` your bullet.
9. Who said the bullet must be shot from your position?
10. Who said the bullet must fly from bottom to top?
11. Who said you can only shot one bullet per key press?
12. {% gist 32f51daac7d17b9e233f %}

### Level 21: endOfTheLine

It is `the End`?

1. This isn't really the last level!
2. The key is `map.finalLevel = true;`.
3. Press `Ctrl+0` to check what is inside.
4. What is in `scripts/` folder?
5. Why some blocks are purple, some others are black?
6. Check `objects.js`, find `exit` object definition.
7. Comment out `if (!game.map.finalLevel) {` and `}`
8. Go to next level!


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


[Untrusted]: http://alexnisnevich.github.io/untrusted/
[Awesome geek game Untrusted]: /blog/2014/11/05/awesome-geek-game-untrusted-the-continuing-adventures-of-dr-eval/
