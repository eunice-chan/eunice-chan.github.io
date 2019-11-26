---
layout: post
title:  "Resource Downloader"
date:   2019-11-23 10:56:45 -0700
categories: [Selenium, programming, summary, project]
---
A week or so ago, I had a midterm for my optimization models course. The course staff had uploaded a lot of resources on Piazza, but there was no easy way to download it all. I briefly considered going through the tables and downloading everything, but then I realized it was the perfect opportunity to learn to use Selenium. Selenium is a software framework for browser automation. I had heard about it before, and had been interested in using it in a project. Mind made up, I decided to put aside several hours to put something together to download all the resources on Piazza.


I was able to log in to Piazza, navigate to the page, and target each file I wanted to download, but then I ran into an issue. Chrome would open every PDF file instead of download it. I tried various approaches from opening the Chrome settings tab and turning off opening PDFs to messing around with the settings of the instance of the web browser.
In the end, I solved my issue by setting it so that Chrome would download the PDFs I open rather than preview them.
I learned a lot about Selenium, which was much less difficult than I had expected. I felt as though the most interesting thing I learned was XPath. Selenium used XPath which I was unfamiliar with. I wasn't sure if I ought to take the time to learn about it, but through various examples I found online, and leaning on my knowledge of HTML and traversing file directories, I was able to quickly pick up enough XPath to achieve my goals.


Overall, I am satisfied with this project. One thing I would like to change would be figuring out why there are errors when I try to run the script with "Restart Kernel & Run All" in Jupyter Notebook but not when I run each cell manually. At the time, I wanted to just get something working so I could switch my attention to studying soon, so I did not spend too much time debugging it. However, if this ends up being something I use frequently, I would definitely want to figure out what is the root cause.
I enjoyed working with Selenium, and would like to work with it in future projects. The reason this caught my eye initially was that I read an article about someone using Selenium to train an AI to learn to play a webgame. I hope to do a similar project in the future.
