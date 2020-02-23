---
layout: default
title: Projects
permalink: /projects/
---

#School Projects

##Hog
Wrote the game logic in Python of an implementation of a dice game called Hog with the addition of several rules. In Hog, two players alternate turns trying to reach 100 points first. On each turn, the current player chooses some number of dice to roll, up to 10. The player scores the sum of the dice outcomes, unless any of the other rules come into play.

##Yelp Map
Created a visualization (Voronoi diagram) with Python of restaurant ratings using machine learning and the Yelp academic dataset. In the visualization, Berkeley is segmented into regions, where each region is shaded by the predicted rating of the closest restaurant (yellow is 5 stars, blue is 1 star) with implementations using the k-means and least-squares linear regression techniques of machine learning.

##Ants Vs. SomeBees
Wrote the game logic in Python for a tower defense game game inspired by Plants vs. Zombies. In Ants vs. SomeBees, the player can place various ants with different abilities into the colony to defend against the invading bees.

##Scheme Interpreter
Wrote an interpreter for a subset of the Scheme language in Python. Learned about the issues that arise in the design of a programming language; many quirks of languages are byproducts of implementation decisions in interpreters and compilers.

##Galaxies
Wrote the game logic in Java of an implementation of a puzzle game called Galaxies. In Galaxies, the player can choose the size of the rectangular board, and a number of "galactic centers" (also known as simply "centers"), displayed as small circles, are placed about the board. The player who is solving the puzzle must place barriers to divide the cells of the board into contiguous "galaxies" that fulfill certain properties (such as symmetry around the
galactic center).

##Enigma
Wrote in Java a simulator of the Enigma machine, which encrypts a message with a progressive substitution, a substitution cipher that is different for each subsequent letter of the message. Details on the design and operator is on Wikipedia. In this implementation, there are 10 rotors and 2 reflectors.

##Amazons
Wrote the game logic and GUI of an implementation of the game originally called El Juego de las Amazonas. Each player gets 4 “Amazons” which must first move, then throw a spear on the 10 x 10 chessboard. The game ends when one player can no longer move. I also wrote the implementation of an AI that is capable of finding a win that is within 10 moves that the player can either play against, or watch play against itself.

##Graphs Library
Wrote a library package to provide facilities for manipulating graphs, plus two clients that use the package. The two clients that used my library are a striped-down implementation of the make program, and a trip-finder.

##Make
Wrote a striped-down implementation of the make program using my graphs library. Given a makefile and information about which objects currently exist and when they were last built, the program outputs which commands (if any) must be executed to rebuild each target, and in what order.

##Trip Finder
Wrote a simple trip-finder using my graphs library. The program is given a map in the form of a list of location names and coordinates, and a list of roads with their direction, length, and endpoints. Assuming the roads are all two-way, when given a request—a sequence of two or more points on the map—the program will produce a shortest route from the first point to the second, third, and so forth.

##C-like Compiler
In the C programming language, I wrote a lexer that tokenizes C-like code . Then, I wrote a parser that creates an AST (abstract syntax tree) of the tokens. Finally, I take in a DAST (decorated AST) and produces RISC-V assembly code which, when executed, performs the actions described in the original C-like file.

##From ALU and Regfile to a CPU
Using Logism, I implemented a simple 32-bit two-cycle processor that can run most RISC-V code through the assembler, linker, and the CPU.

##Performance Programming
Given a pre-trained CNN (convolutional neural network) that classifies 32x32 RGB images into 10 categories, I optimized its performance to achieve a 16x speedup. Written in C, I optimized with a variety of techniques, most notably, by parallelizing operations and computations with OpenMD and SIMD.

##Golang Concurrent Cached File Server
Using Go, I implemented a simple file server with file caching where the cache has a limited size. I respond to http requests for a file by writing the data as response and adding it to the cache. As we have learned about the security vulnerabilities a file server could have, I also did basic request filename string sanitization.

##Voice-Controlled Robot Car
In a team, we designed and built a microphone circuit. By recording sounds with the circuit and using machine learning (specifically SVD/PCA) to create clusters, we were able to verbally control the robot’s movements.

##World Progress
Using data from Gapminder.org, I explored the trends of poverty around the world. I did both longitudinal analyses (looking at change through time) and latitudinal analyses (comparing among the countries). By plotting the data on a map, using scatter and line plots, I was able to draw interesting insights from the dataset.

##Diet and Disease
Drawing on data from a number of datasets, I investigate the major causes of death in the world, as well as how one of these causes, heart disease, might be linked to diet. I accomplish this by creating visualizations as well as bootstrapping the data to run an A/B test to identify correlation.

##Classifying Movies
I built a k-nearest-neighbors classifier that classified movies as either romance or action, using only the numbers of times words (stemmed) appear in the movies' screenplay.

## Spam versus Ham Email Classification
Classified spam/ham emails creating features from the words in the emails and logistic regression. In the leaderboard calculated with 30% of the test data, ranked 3rd place (of the 967 students in the class) with an accuracy of 1.00000 while in the leaderboard calculated with 70% of the test data, ranked 1st place (of 967) in the class with an accuracy of 0.99571.

##SVM Classification
Classified with SVM on three datasets: CIFAR-10 (ranked 20 out of 830 students in the class), SPAM (ranked 34 out of 845 students in the class), and MNIST (ranked 37 out of 844 students in the class). CIFAR-10 is a dataset of 10 classes of images, SPAM is a spam vs ham email dataset, and MNIST is a dataset of handwritten digits.
