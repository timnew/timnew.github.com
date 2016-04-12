layout: post
title: HTML codes to put special characters on your Web page
tags:
  - encoding
  - html
  - escape
  - unicode
categories:
  - Programming
  - C#
comments: true
date: 2012-02-04 08:00:00
---
尝试了一下用 LinqPad 把各种诡异的字母转成 Html 编码～结果发现不是左右字符都能转过去～
.net 内置的工具并不能完美的处理所有的Html编码～

[字符来源](http://webdesign.about.com/library/bl_htmlcodes.htm)

**Query**
{% codeblock Get html escaped unicodes lang:csharp %}
"A,a,À,à,Á,á,Â,â,Ã,ã,Ä,ä,Å,å,Ā,ā,Ă,ă,Ą,ą,Ǟ,ǟ,Ǻ,ǻ,Æ,æ,Ǽ,ǽ,B,b,Ḃ,ḃ,C,c,Ć,ć,Ç,ç,Č,č,Ĉ,ĉ,Ċ,ċ,D,d,Ḑ,ḑ,Ď,ď,Ḋ,ḋ,Đ,đ,Ð,ð,Ǳ,ǳ,Ǆ,ǆ,E,e,È,è,É,é,Ě,ě,Ê,ê,Ë,ë,Ē,ē,Ĕ,ĕ,Ę,ę,Ė,ė,Ʒ,ʒ,Ǯ,ǯ,F,f,Ḟ,ḟ,ƒ,ﬀ,ﬁ,ﬂ,ﬃ,ﬄ,ﬅ,G,g,Ǵ,ǵ,Ģ,ģ,Ǧ,ǧ,Ĝ,ĝ,Ğ,ğ,Ġ,ġ,Ǥ,ǥ,H,h,Ĥ,ĥ,Ħ,ħ,I,i,Ì,ì,Í,í,Î,î,Ĩ,ĩ,Ï,ï,Ī,ī,Ĭ,ĭ,Į,į,İ,ı,Ĳ,ĳ,J,j,Ĵ,ĵ,K,k,Ḱ,ḱ,Ķ,ķ,Ǩ,ǩ,ĸ,L,l,Ĺ,ĺ,Ļ,ļ,Ľ,ľ,Ŀ,ŀ,Ł,ł,Ǉ,ǉ,M,m,Ṁ,ṁ,N,n,Ń,ń,Ņ,ņ,Ň,ň,Ñ,ñ,ŉ,Ŋ,ŋ,Ǌ,ǌ,O,o,Ò,ò,Ó,ó,Ô,ô,Õ,õ,Ö,ö,Ō,ō,Ŏ,ŏ,Ø,ø,Ő,ő,Ǿ,ǿ,Œ,œ,P,p,Ṗ,ṗ,Q,q,R,r,Ŕ,ŕ,Ŗ,ŗ,Ř,ř,ɼ,S,s,Ś,ś,Ş,ş,Š,š,Ŝ,ŝ,Ṡ,ṡ,ſ,ß,T,t,Ţ,ţ,Ť,ť,Ṫ,ṫ,Ŧ,ŧ,Þ,þ,U,u,Ù,ù,Ú,ú,Û,û,Ũ,ũ,Ü,ü,Ů,ů,Ū,ū,Ŭ,ŭ,Ų,ų,Ű,ű,V,v,W,w,Ẁ,ẁ,Ẃ,ẃ,Ŵ,ŵ,Ẅ,ẅ,X,x,Y,y,Ỳ,ỳ,Ý,ý,Ŷ,ŷ,Ÿ,ÿ,Z,z,Ź,ź,Ž,ž,Ż,ż"
.Split(',')
.ToDictionary(k=>k,HttpUtility.HtmlEncode)
{% endcodeblock %}

**Result**

`Dictionary<String,String>`  
`(304 items)`

<table>
	<tr><th>Key</th><th>Value</th></tr>
	<tr><td>A</td><td>A</td></tr>
	<tr><td>a</td><td>a</td></tr>
	<tr><td>À</td><td>&amp;#192;</td></tr>
	<tr><td>à</td><td>&amp;#224;</td></tr>
	<tr><td>Á</td><td>&amp;#193;</td></tr>
	<tr><td>á</td><td>&amp;#225;</td></tr>
	<tr><td>Â</td><td>&amp;#194;</td></tr>
	<tr><td>â</td><td>&amp;#226;</td></tr>
	<tr><td>Ã</td><td>&amp;#195;</td></tr>
	<tr><td>ã</td><td>&amp;#227;</td></tr>
	<tr><td>Ä</td><td>&amp;#196;</td></tr>
	<tr><td>ä</td><td>&amp;#228;</td></tr>
	<tr><td>Å</td><td>&amp;#197;</td></tr>
	<tr><td>å</td><td>&amp;#229;</td></tr>
	<tr><td>Ā</td><td>Ā</td></tr>
	<tr><td>ā</td><td>ā</td></tr>
	<tr><td>Ă</td><td>Ă</td></tr>
	<tr><td>ă</td><td>ă</td></tr>
	<tr><td>Ą</td><td>Ą</td></tr>
	<tr><td>ą</td><td>ą</td></tr>
	<tr><td>Ǟ</td><td>Ǟ</td></tr>
	<tr><td>ǟ</td><td>ǟ</td></tr>
	<tr><td>Ǻ</td><td>Ǻ</td></tr>
	<tr><td>ǻ</td><td>ǻ</td></tr>
	<tr><td>Æ</td><td>&amp;#198;</td></tr>
	<tr><td>æ</td><td>&amp;#230;</td></tr>
	<tr><td>Ǽ</td><td>Ǽ</td></tr>
	<tr><td>ǽ</td><td>ǽ</td></tr>
	<tr><td>B</td><td>B</td></tr>
	<tr><td>b</td><td>b</td></tr>
	<tr><td>Ḃ</td><td>Ḃ</td></tr>
	<tr><td>ḃ</td><td>ḃ</td></tr>
	<tr><td>C</td><td>C</td></tr>
	<tr><td>c</td><td>c</td></tr>
	<tr><td>Ć</td><td>Ć</td></tr>
	<tr><td>ć</td><td>ć</td></tr>
	<tr><td>Ç</td><td>&amp;#199;</td></tr>
	<tr><td>ç</td><td>&amp;#231;</td></tr>
	<tr><td>Č</td><td>Č</td></tr>
	<tr><td>č</td><td>č</td></tr>
	<tr><td>Ĉ</td><td>Ĉ</td></tr>
	<tr><td>ĉ</td><td>ĉ</td></tr>
	<tr><td>Ċ</td><td>Ċ</td></tr>
	<tr><td>ċ</td><td>ċ</td></tr>
	<tr><td>D</td><td>D</td></tr>
	<tr><td>d</td><td>d</td></tr>
	<tr><td>Ḑ</td><td>Ḑ</td></tr>
	<tr><td>ḑ</td><td>ḑ</td></tr>
	<tr><td>Ď</td><td>Ď</td></tr>
	<tr><td>ď</td><td>ď</td></tr>
	<tr><td>Ḋ</td><td>Ḋ</td></tr>
	<tr><td>ḋ</td><td>ḋ</td></tr>
	<tr><td>Đ</td><td>Đ</td></tr>
	<tr><td>đ</td><td>đ</td></tr>
	<tr><td>Ð</td><td>&amp;#208;</td></tr>
	<tr><td>ð</td><td>&amp;#240;</td></tr>
	<tr><td>Ǳ</td><td>Ǳ</td></tr>
	<tr><td>ǳ</td><td>ǳ</td></tr>
	<tr><td>Ǆ</td><td>Ǆ</td></tr>
	<tr><td>ǆ</td><td>ǆ</td></tr>
	<tr><td>E</td><td>E</td></tr>
	<tr><td>e</td><td>e</td></tr>
	<tr><td>È</td><td>&amp;#200;</td></tr>
	<tr><td>è</td><td>&amp;#232;</td></tr>
	<tr><td>É</td><td>&amp;#201;</td></tr>
	<tr><td>é</td><td>&amp;#233;</td></tr>
	<tr><td>Ě</td><td>Ě</td></tr>
	<tr><td>ě</td><td>ě</td></tr>
	<tr><td>Ê</td><td>&amp;#202;</td></tr>
	<tr><td>ê</td><td>&amp;#234;</td></tr>
	<tr><td>Ë</td><td>&amp;#203;</td></tr>
	<tr><td>ë</td><td>&amp;#235;</td></tr>
	<tr><td>Ē</td><td>Ē</td></tr>
	<tr><td>ē</td><td>ē</td></tr>
	<tr><td>Ĕ</td><td>Ĕ</td></tr>
	<tr><td>ĕ</td><td>ĕ</td></tr>
	<tr><td>Ę</td><td>Ę</td></tr>
	<tr><td>ę</td><td>ę</td></tr>
	<tr><td>Ė</td><td>Ė</td></tr>
	<tr><td>ė</td><td>ė</td></tr>
	<tr><td>Ʒ</td><td>Ʒ</td></tr>
	<tr><td>ʒ</td><td>ʒ</td></tr>
	<tr><td>Ǯ</td><td>Ǯ</td></tr>
	<tr><td>ǯ</td><td>ǯ</td></tr>
	<tr><td>F</td><td>F</td></tr>
	<tr><td>f</td><td>f</td></tr>
	<tr><td>Ḟ</td><td>Ḟ</td></tr>
	<tr><td>ḟ</td><td>ḟ</td></tr>
	<tr><td>ƒ</td><td>ƒ</td></tr>
	<tr><td>ﬀ</td><td>ﬀ</td></tr>
	<tr><td>ﬁ</td><td>ﬁ</td></tr>
	<tr><td>ﬂ</td><td>ﬂ</td></tr>
	<tr><td>ﬃ</td><td>ﬃ</td></tr>
	<tr><td>ﬄ</td><td>ﬄ</td></tr>
	<tr><td>ﬅ</td><td>ﬅ</td></tr>
	<tr><td>G</td><td>G</td></tr>
	<tr><td>g</td><td>g</td></tr>
	<tr><td>Ǵ</td><td>Ǵ</td></tr>
	<tr><td>ǵ</td><td>ǵ</td></tr>
	<tr><td>Ģ</td><td>Ģ</td></tr>
	<tr><td>ģ</td><td>ģ</td></tr>
	<tr><td>Ǧ</td><td>Ǧ</td></tr>
	<tr><td>ǧ</td><td>ǧ</td></tr>
	<tr><td>Ĝ</td><td>Ĝ</td></tr>
	<tr><td>ĝ</td><td>ĝ</td></tr>
	<tr><td>Ğ</td><td>Ğ</td></tr>
	<tr><td>ğ</td><td>ğ</td></tr>
	<tr><td>Ġ</td><td>Ġ</td></tr>
	<tr><td>ġ</td><td>ġ</td></tr>
	<tr><td>Ǥ</td><td>Ǥ</td></tr>
	<tr><td>ǥ</td><td>ǥ</td></tr>
	<tr><td>H</td><td>H</td></tr>
	<tr><td>h</td><td>h</td></tr>
	<tr><td>Ĥ</td><td>Ĥ</td></tr>
	<tr><td>ĥ</td><td>ĥ</td></tr>
	<tr><td>Ħ</td><td>Ħ</td></tr>
	<tr><td>ħ</td><td>ħ</td></tr>
	<tr><td>I</td><td>I</td></tr>
	<tr><td>i</td><td>i</td></tr>
	<tr><td>Ì</td><td>&amp;#204;</td></tr>
	<tr><td>ì</td><td>&amp;#236;</td></tr>
	<tr><td>Í</td><td>&amp;#205;</td></tr>
	<tr><td>í</td><td>&amp;#237;</td></tr>
	<tr><td>Î</td><td>&amp;#206;</td></tr>
	<tr><td>î</td><td>&amp;#238;</td></tr>
	<tr><td>Ĩ</td><td>Ĩ</td></tr>
	<tr><td>ĩ</td><td>ĩ</td></tr>
	<tr><td>Ï</td><td>&amp;#207;</td></tr>
	<tr><td>ï</td><td>&amp;#239;</td></tr>
	<tr><td>Ī</td><td>Ī</td></tr>
	<tr><td>ī</td><td>ī</td></tr>
	<tr><td>Ĭ</td><td>Ĭ</td></tr>
	<tr><td>ĭ</td><td>ĭ</td></tr>
	<tr><td>Į</td><td>Į</td></tr>
	<tr><td>į</td><td>į</td></tr>
	<tr><td>İ</td><td>İ</td></tr>
	<tr><td>ı</td><td>ı</td></tr>
	<tr><td>Ĳ</td><td>Ĳ</td></tr>
	<tr><td>ĳ</td><td>ĳ</td></tr>
	<tr><td>J</td><td>J</td></tr>
	<tr><td>j</td><td>j</td></tr>
	<tr><td>Ĵ</td><td>Ĵ</td></tr>
	<tr><td>ĵ</td><td>ĵ</td></tr>
	<tr><td>K</td><td>K</td></tr>
	<tr><td>k</td><td>k</td></tr>
	<tr><td>Ḱ</td><td>Ḱ</td></tr>
	<tr><td>ḱ</td><td>ḱ</td></tr>
	<tr><td>Ķ</td><td>Ķ</td></tr>
	<tr><td>ķ</td><td>ķ</td></tr>
	<tr><td>Ǩ</td><td>Ǩ</td></tr>
	<tr><td>ǩ</td><td>ǩ</td></tr>
	<tr><td>ĸ</td><td>ĸ</td></tr>
	<tr><td>L</td><td>L</td></tr>
	<tr><td>l</td><td>l</td></tr>
	<tr><td>Ĺ</td><td>Ĺ</td></tr>
	<tr><td>ĺ</td><td>ĺ</td></tr>
	<tr><td>Ļ</td><td>Ļ</td></tr>
	<tr><td>ļ</td><td>ļ</td></tr>
	<tr><td>Ľ</td><td>Ľ</td></tr>
	<tr><td>ľ</td><td>ľ</td></tr>
	<tr><td>Ŀ</td><td>Ŀ</td></tr>
	<tr><td>ŀ</td><td>ŀ</td></tr>
	<tr><td>Ł</td><td>Ł</td></tr>
	<tr><td>ł</td><td>ł</td></tr>
	<tr><td>Ǉ</td><td>Ǉ</td></tr>
	<tr><td>ǉ</td><td>ǉ</td></tr>
	<tr><td>M</td><td>M</td></tr>
	<tr><td>m</td><td>m</td></tr>
	<tr><td>Ṁ</td><td>Ṁ</td></tr>
	<tr><td>ṁ</td><td>ṁ</td></tr>
	<tr><td>N</td><td>N</td></tr>
	<tr><td>n</td><td>n</td></tr>
	<tr><td>Ń</td><td>Ń</td></tr>
	<tr><td>ń</td><td>ń</td></tr>
	<tr><td>Ņ</td><td>Ņ</td></tr>
	<tr><td>ņ</td><td>ņ</td></tr>
	<tr><td>Ň</td><td>Ň</td></tr>
	<tr><td>ň</td><td>ň</td></tr>
	<tr><td>Ñ</td><td>&amp;#209;</td></tr>
	<tr><td>ñ</td><td>&amp;#241;</td></tr>
	<tr><td>ŉ</td><td>ŉ</td></tr>
	<tr><td>Ŋ</td><td>Ŋ</td></tr>
	<tr><td>ŋ</td><td>ŋ</td></tr>
	<tr><td>Ǌ</td><td>Ǌ</td></tr>
	<tr><td>ǌ</td><td>ǌ</td></tr>
	<tr><td>O</td><td>O</td></tr>
	<tr><td>o</td><td>o</td></tr>
	<tr><td>Ò</td><td>&amp;#210;</td></tr>
	<tr><td>ò</td><td>&amp;#242;</td></tr>
	<tr><td>Ó</td><td>&amp;#211;</td></tr>
	<tr><td>ó</td><td>&amp;#243;</td></tr>
	<tr><td>Ô</td><td>&amp;#212;</td></tr>
	<tr><td>ô</td><td>&amp;#244;</td></tr>
	<tr><td>Õ</td><td>&amp;#213;</td></tr>
	<tr><td>õ</td><td>&amp;#245;</td></tr>
	<tr><td>Ö</td><td>&amp;#214;</td></tr>
	<tr><td>ö</td><td>&amp;#246;</td></tr>
	<tr><td>Ō</td><td>Ō</td></tr>
	<tr><td>ō</td><td>ō</td></tr>
	<tr><td>Ŏ</td><td>Ŏ</td></tr>
	<tr><td>ŏ</td><td>ŏ</td></tr>
	<tr><td>Ø</td><td>&amp;#216;</td></tr>
	<tr><td>ø</td><td>&amp;#248;</td></tr>
	<tr><td>Ő</td><td>Ő</td></tr>
	<tr><td>ő</td><td>ő</td></tr>
	<tr><td>Ǿ</td><td>Ǿ</td></tr>
	<tr><td>ǿ</td><td>ǿ</td></tr>
	<tr><td>Œ</td><td>Œ</td></tr>
	<tr><td>œ</td><td>œ</td></tr>
	<tr><td>P</td><td>P</td></tr>
	<tr><td>p</td><td>p</td></tr>
	<tr><td>Ṗ</td><td>Ṗ</td></tr>
	<tr><td>ṗ</td><td>ṗ</td></tr>
	<tr><td>Q</td><td>Q</td></tr>
	<tr><td>q</td><td>q</td></tr>
	<tr><td>R</td><td>R</td></tr>
	<tr><td>r</td><td>r</td></tr>
	<tr><td>Ŕ</td><td>Ŕ</td></tr>
	<tr><td>ŕ</td><td>ŕ</td></tr>
	<tr><td>Ŗ</td><td>Ŗ</td></tr>
	<tr><td>ŗ</td><td>ŗ</td></tr>
	<tr><td>Ř</td><td>Ř</td></tr>
	<tr><td>ř</td><td>ř</td></tr>
	<tr><td>ɼ</td><td>ɼ</td></tr>
	<tr><td>S</td><td>S</td></tr>
	<tr><td>s</td><td>s</td></tr>
	<tr><td>Ś</td><td>Ś</td></tr>
	<tr><td>ś</td><td>ś</td></tr>
	<tr><td>Ş</td><td>Ş</td></tr>
	<tr><td>ş</td><td>ş</td></tr>
	<tr><td>Š</td><td>Š</td></tr>
	<tr><td>š</td><td>š</td></tr>
	<tr><td>Ŝ</td><td>Ŝ</td></tr>
	<tr><td>ŝ</td><td>ŝ</td></tr>
	<tr><td>Ṡ</td><td>Ṡ</td></tr>
	<tr><td>ṡ</td><td>ṡ</td></tr>
	<tr><td>ſ</td><td>ſ</td></tr>
	<tr><td>ß</td><td>&amp;#223;</td></tr>
	<tr><td>T</td><td>T</td></tr>
	<tr><td>t</td><td>t</td></tr>
	<tr><td>Ţ</td><td>Ţ</td></tr>
	<tr><td>ţ</td><td>ţ</td></tr>
	<tr><td>Ť</td><td>Ť</td></tr>
	<tr><td>ť</td><td>ť</td></tr>
	<tr><td>Ṫ</td><td>Ṫ</td></tr>
	<tr><td>ṫ</td><td>ṫ</td></tr>
	<tr><td>Ŧ</td><td>Ŧ</td></tr>
	<tr><td>ŧ</td><td>ŧ</td></tr>
	<tr><td>Þ</td><td>&amp;#222;</td></tr>
	<tr><td>þ</td><td>&amp;#254;</td></tr>
	<tr><td>U</td><td>U</td></tr>
	<tr><td>u</td><td>u</td></tr>
	<tr><td>Ù</td><td>&amp;#217;</td></tr>
	<tr><td>ù</td><td>&amp;#249;</td></tr>
	<tr><td>Ú</td><td>&amp;#218;</td></tr>
	<tr><td>ú</td><td>&amp;#250;</td></tr>
	<tr><td>Û</td><td>&amp;#219;</td></tr>
	<tr><td>û</td><td>&amp;#251;</td></tr>
	<tr><td>Ũ</td><td>Ũ</td></tr>
	<tr><td>ũ</td><td>ũ</td></tr>
	<tr><td>Ü</td><td>&amp;#220;</td></tr>
	<tr><td>ü</td><td>&amp;#252;</td></tr>
	<tr><td>Ů</td><td>Ů</td></tr>
	<tr><td>ů</td><td>ů</td></tr>
	<tr><td>Ū</td><td>Ū</td></tr>
	<tr><td>ū</td><td>ū</td></tr>
	<tr><td>Ŭ</td><td>Ŭ</td></tr>
	<tr><td>ŭ</td><td>ŭ</td></tr>
	<tr><td>Ų</td><td>Ų</td></tr>
	<tr><td>ų</td><td>ų</td></tr>
	<tr><td>Ű</td><td>Ű</td></tr>
	<tr><td>ű</td><td>ű</td></tr>
	<tr><td>V</td><td>V</td></tr>
	<tr><td>v</td><td>v</td></tr>
	<tr><td>W</td><td>W</td></tr>
	<tr><td>w</td><td>w</td></tr>
	<tr><td>Ẁ</td><td>Ẁ</td></tr>
	<tr><td>ẁ</td><td>ẁ</td></tr>
	<tr><td>Ẃ</td><td>Ẃ</td></tr>
	<tr><td>ẃ</td><td>ẃ</td></tr>
	<tr><td>Ŵ</td><td>Ŵ</td></tr>
	<tr><td>ŵ</td><td>ŵ</td></tr>
	<tr><td>Ẅ</td><td>Ẅ</td></tr>
	<tr><td>ẅ</td><td>ẅ</td></tr>
	<tr><td>X</td><td>X</td></tr>
	<tr><td>x</td><td>x</td></tr>
	<tr><td>Y</td><td>Y</td></tr>
	<tr><td>y</td><td>y</td></tr>
	<tr><td>Ỳ</td><td>Ỳ</td></tr>
	<tr><td>ỳ</td><td>ỳ</td></tr>
	<tr><td>Ý</td><td>&amp;#221;</td></tr>
	<tr><td>ý</td><td>&amp;#253;</td></tr>
	<tr><td>Ŷ</td><td>Ŷ</td></tr>
	<tr><td>ŷ</td><td>ŷ</td></tr>
	<tr><td>Ÿ</td><td>Ÿ</td></tr>
	<tr><td>ÿ</td><td>&amp;#255;</td></tr>
	<tr><td>Z</td><td>Z</td></tr>
	<tr><td>z</td><td>z</td></tr>
	<tr><td>Ź</td><td>Ź</td></tr>
	<tr><td>ź</td><td>ź</td></tr>
	<tr><td>Ž</td><td>Ž</td></tr>
	<tr><td>ž</td><td>ž</td></tr>
	<tr><td>Ż</td><td>Ż</td></tr>
	<tr><td>ż</td><td>ż</td></tr>
</table>