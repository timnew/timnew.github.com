---
layout: post
title: "Plants vs Zombie Cheat Engine +3 Trainer"
description: ""
category: Game
tags: ["PVZ", "Game", "Cheat Engine", "Trainer", "Cheat", "CHT"]

---

* Collect Sunshine Cheat: Give 0x8FF sunshine when player pick any sun shine, overflow protection is enabled
* Consume Sunshine Cheat: Set Sunhine to 0xFFF when any sunshine is consumed
* Cool Down Cheat: No Cool Down time for plants

{% codeblock Cheat-Engine cheat sheet definition %}
//Cheat Code

//==============================================
//Collect Sunshine Cheat
//==============================================
[ENABLE]
alloc(collectMoneyCheat,512) 
label(collectMoneyReturn)
label(collectMoneyOriginal)
label(collectMoneyExit)

0041E6E0:
jmp collectMoneyCheat
nop
collectMoneyReturn:

collectMoneyCheat: 
cmp [eax+00005578],FFFF  // Overflow protection
jge collectMoneyExit
mov ecx, 8FF

collectMoneyOriginal:
add [eax+00005578],ecx

collectMoneyExit:
jmp collectMoneyReturn

[DISABLE]
dealloc(collectMoneyCheat)
0041E6E0:
add [eax+00005578],ecx
//==============================================


//==============================================
//Consume Sunshine Cheat
//==============================================
[ENABLE]

alloc(consumeMoneyCheat,512) 
label(consumeMoneyReturn)
label(consumeMoneyOriginal)
label(consumeMoneyExit)

0041E844:
jmp consumeMoneyCheat
nop
nop
nop
consumeMoneyReturn:

consumeMoneyCheat: 
mov esi, FFFF //Show me the money ;)
mov [edi+00005578],esi

consumeMoneyOriginal:
/*
sub esi,ebx
mov [edi+00005578],esi
*/

consumeMoneyExit:
jmp consumeMoneyReturn

[DISABLE]
dealloc(consumeMoneyCheat)
0041E844:
sub esi,ebx
mov [edi+00005578],esi
//==============================================


//==============================================
//Cool Down Cheat
//==============================================
[ENABLE]
alloc(coolDown,512)
label(coolDownReturn)
label(coolDownOriginal)
label(coolDownExit)

00491E4C:
jmp coolDown
nop
coolDownReturn:

coolDown:  
//place your code here
mov eax, [edi+28] 
mov [edi+24], eax

coolDownOriginal:
inc [edi+24]
mov eax,[edi+24]

coolDownExit:
jmp coolDownReturn

[DISABLE]
dealloc(coolDown) 
00491E4C:
inc [edi+24]
mov eax,[edi+24]
//==============================================
{% endcodeblock %}

Tested on Win XP SP3 EN+Pvz GOTY EN