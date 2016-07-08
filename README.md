# HTML5 Grunt Quickstart
Or, a whole bunch of things I've glued together over a handful of projects to help me make web stuff.

## About Me
I'm a designer/developer. I make web sites and web things. I'm also nerdishly interested in how things work (or don't work), and the web and web design and development offer boundless vistas of things that work (or don't work), all ripe for the investigation. It's fun.

## About This Repo
I've put together this repo over a handful of web projects as a way of helping me get off the ground with those projects and as a way of learning about how some of these web development tools and methodologies work. I've seen repos like Gulp Quickstart that serve this purpose, but for someone like me they can tend to feel like impenetrable monoliths of code and configuration. I kind of need to make a thing myself to really understand it. And now to help me further understand this stuff, I'm forcing myself to document the heck out of it and then release it, in the hopes that it helps me and maybe saves someone else some time, too, as they look for ways to wrap their heads around all this stuff.

## Challenge / Process
Basically, here's my thing. When I'm making a thing, I want to sit down and start making it.  I need to start making it One challenge I've had, as I've learned how to do this, is finding a neat way to sit down and start making a thing in such a way that I can go nuts on it for as long as I need to, while keeping an eye toward creating something release-ready.

This repo is the result of me gluing things together as I've needed to solve various challenges related to that. It's also the result of me just being curious about how those various things themselves that I've been gluing together have worked. It's pretty nerdy; it's pretty fun.

If that's something you might like to do, maybe you'll find this project useful. Or if you're just getting into anything that this project touches on, maybe you'll find bits of this project informative as you develop your own tools or process.

## Structure
At the end of the day though what all this stuff helps me do is this:

1. Sit down and start developing a site or a thing on my computer while quickly previewing changes live in the browser.
2. When I'm ready to move something to production, or share progress with others, I can quickly generate a relatively disposable set of production-ready files that can live on its own.

To that end:

- All project development assets are located in the **src** folder.
- Production-ready files will be output to a **dist** folder.
- In the project root, you'll find the package.json file and the Gruntfile.js file, both of which help you do development stuff. Once you get up and running, you'll create a node_modules folder (which you can basically ignore, unless you're prepared to dive way deep down the module rabbit hole).

## Requirements
Some things you'll need to install if you want to use this repo as-is include the following. Setting all this stuff up the first time is, admittedly, kind of weird and confusing, I think? But the good news is basically once you get it all set up, you mostly don't have to worry about it too much. Mostly. Sort of. (Have I mentioned that web development is a rather volatile world? Yes? No?)

- A code editor. One you really like. I like SublimeText. You can use whatever you want.
    + Specifically, a code editor you really like. It took me a while to land on SublimeText, but now I can't imagine life without it. It's basically one of my favorite things. But don't just use it because some random guy on the Internet said he likes it. Try a few out. Break a few in. See what you like. See what you love. See where that love takes you.
- Some browsers. Maybe some different devices.
    + You're going to need something to look at your work in. If you're thinking responsive development or accessible development, you should have some other devices to check your work in, as well.
- A LiveReload extension in your browser.
    + This one, actually, I'm not sure right now if it's a requirement. Note to self: go back and do a little research on this. I think I have one installed in Chrome but not my other desktop browsers. And I don't think I installed one on my iPhone. (If you have trouble with LiveReload, let me know.)
- NodeJS.
    + "But I'm not making Node apps!" you say. Well, you still need Node installed to run some of the development software this repo requires. Personally, as of right now, I've only barely begun to dabble in Node development, so suffice it to say that knowing Node is *not* a requirement for making web things.
- NPM.
    + NPM is a JavaScript package manager. Which is kind of a fancy way of saying a software downloader and installer. NPM does a lot of magic for you.
- Grunt-cli.
    + Again, this falls into things that might not *exactly* be a requirement; but I also think right now it doesn't exactly hurt, so you might as well just have it installed globally so it's there for you at the start of your project.

I've tried to point toward installation instructions above but honestly there's a big distance between me writing this file right now and when I last set this stuff up for myself from scratch, so I'm not sure what's changed or broken since, or what I'm leaving out because I forgot about it. Time permitting, I'll do a run through myself, somehow, and see what happens. I also can't make promises about platform-specific requirements; I work exclusively on Macs these days, though I did do everything I needed to on Windows at my previous job, so I know most if not all of this stuff is possible. And with Linux coming to Windows, I mean, man, I don't even know. Yow. Should be even easier.

## How To Use It
Okay, you've got everything installed, hopefully it's all working, and now you're ready to sit down and make a thing. Cool. Let's begin.

Your basic process is going ot look something like this:

1. npm install
2. grunt devPrep
3. grunt prodReady

...cycling between 2 and 3 until you make the single most perfect *thing* that's ever been made, and you can stop working and call it a day.

Let's look at the steps in detail:

1. npm install

This rips open a hole in the fabric of space-time and lets the magic pour directly out onto your hard drive. Specifically into a node_modules folder that will magically appear in the project root directory.

Chances are you will never, ever, ever need to actually look in the node_modules folder. If anything you might check the size of it and wonder what life choices we've all made that necessitates a 100-odd MB folder full of mystery goo just to make a website about your cats. I have no answers for you about that, but what I can say is that this folder is essentially disposable, so if you've finished working on a project you can safely delete it and exhale and go outside and look at the trees and be just fine. You can always run npm install again if you need to do more work later, after it's too dark to look at the trees.

2. grunt devPrep

Okay, now you're putting the magic to work for you. This does some initial book keeping to get everything ready for you to do your work and then it goes into watch mode, waiting for you to start working.

At this point you can open up your browser and point it at localhost:1337 and see the starter HTML file there, being served up directly from your **src** folder. Cool. Go ahead, edit the index.html file, hit save, and then look back at your browser. See how it changed? Yeah, this is when things get fun.

2.5 Make a thing.

More details below on the things you can play with in the src folder.

3. grunt prodReady

Alright!


## What Those Pieces Are
