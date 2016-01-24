---
title: The realms of distributed frontend integration
date: 2016-01-10
category: frontend architecture
tldr: Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
---

## what we aim for

Recently some colleagues and me ended up in a discussion about frontend architecture in a distributed service environment. This post shoould sum up some of the thoughts that were mentioned there. Before we start, i first want to thank [@tillsc](https://twitter.com/tillsc) and [@ewolff](https://twitter.com/ewolff) for their enlightenments.

If we talk about web applications sliced into smaller applications, we often discuss problems like distributed storage or about the business scope of the targeted applications.   
But as a problem that got more attention lately, we want to talk about the different solutions of how to provide frontend assets to a microservice or [SCS](http://scs-architecture.org/) landscape.

To make sure, that this article is not another discussion about how big services should be sliced, lets assume that we have a set of business scoped pillars, that each provide a view on a different scope of your business landscape.

### uniformity
In such an environment, there are different requirements that emerge from our decision of slicing an app domain to multiple apps in favour to have a business monolith. While it is natural,  that your application has the same look and feel throughout your application in a monolith, it is a factor we have to care or in distributed apps. So **uniformity** is our first qualifier for a good distributed frontend architecture, because for many different reasons, it makes sense to provide a seamless user experience over all applications.

### independence
One key requirement which we aim for, when deciding for a distributed application architecture is **independency** in development and deployment of our services. We want to have services to be releasable as often as we want, maybe a few times a day or even every few minutes. So while it is a good practice to provide a central UI Kit for building distributed frontends, so that it is easy to bring the look and feel into place, each application with a seperate UI should be able to release own assets into place if they have a need for them.   

As an example just think of a service pillar, that is responsibe for the representation of business analytics delivering a big pile of chart related assets and similar that is not needed anywhere else in our application set. There should be no reason not to release a  new version of that service pillar to production in case the updates are scoped to the chart libraries. In contrast to that, changes in the centralized UI kit, that is included in the service should not block any deployments of this service, if we want to speak about independence.

### syncronicity
A management requirement, that is often sneaking in, in discussions about frontend architecture is that all service pillars should look the same all the time. It means that any changes in the centralized part of our UI should be in place immediatly after the changes are deployed. So the uniform look and feel of the application should be in **sync** all the time.


## Pick 2 out of 3

If you are familiar with distributed application architecture or distributed storage you may have read something about [Eric Brewers](http://www.cs.berkeley.edu/~brewer/) [CAP](http://www.cs.berkeley.edu/~brewer/cs262b-2004/PODC-keynote.pdf) theorem. In short it tells us that you have to choose at most two properties out of Consistency, Availability and Partition Tolerance.

As a disclaimer i don’t want to claim something likewise ingenious for myself, but i didn’t overcome that there seems to be similar pattern for **independency**, **uniformity** and **syncronicity** at distributed frontends.
