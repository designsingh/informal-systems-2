---
layout: post
title: "Dev Update: Apalache"
author: Igor Konnov & Ethan Buchman
featuredImage: "/img/posts/model-testing.png"
---

[TLA+][] is a tried and tested and [widely adopted][] language for specifying
systems. However, formal verification research has made huge leaps forward since
the tooling for TLA+ was devised in the late 90s. Our research team
has been actively working to fill this gap between state-of-the-art
formal verification and the tooling for TLA+. We have been developing
[Apalache][], a symbolic model checker for
TLA+. Apalache leverages the power of [SMT solvers] to reason about states and
transitions in terms of a logic of constraints, rather than in terms of individual
states and transitions.

For a quick example, imagine that we want to answer this question:

_Are there m and n in the range from 2 to 1000000 such that m * n = 999999?_

Or in TLA+ words:

```tla+
\E m, n \in 2..1000000:
  m * n = 999999 /\ answer' = TRUE
```

Apalache finds an answer in less than a second, e.g., `m = 333333` and `n = 3`.
Had we tried it with TLC -- the standard model checker for TLA+ -- we would
have to wait for ages. See [factorization.tla][] for a complete example.

The above example looks like a foreign language to many engineers, and for good
reason. Thus our first goal with TLA+ tooling is to improve developer
experience.  Our second goal is to integrate TLA+ specifications with real
code. The latter is currently being pursued via [Model Based Testing],
where complex test cases for real code are generated from small amounts of
TLA+.

TLA+ is an untyped language. This suits well the TLC model checker, as it
dynamically checks values while exploring states. However, the untyped nature
of the language poses challenges for tools that use SMT in the backend.  For
instance, both [Apalache][] and the [TLAPS][] do some form of type inference
for TLA+ in the background. So far, both tools have been hiding type inference
and types from users.  With the new type checker [Snowcat][] (see below),
users can use types as an independent analysis tool! We believe that a
common infrastructure for typed TLA+ will boost new ideas for TLA+ tooling.

Check the [Talk at Interchain Conversations] to see how we are using TLA+ and
Apalache at Informal Systems.

# Our focus in Q3-Q4 of 2020

Much of the focus of the past six months has been on improving the stability
and usability of the model checker. After receiving feedback from our internal
users at Informal Systems, we found out that many users never reached
the stage when they saw the power of the model checker. Instead, they were
stumbling upon three issues:

 1. **How do I write TLA+?** The documentation is scattered across many sources,
 some of it is significantly outdated.

 2. **Why is Apalache complaining about types?** The old type checker in Apalache
 is ad-hoc and is optimized for the model checker, not for the users.

 3. **Why is Apalache complaining about assignments?** Again, the model checker
 was not helping the users to understand what it was doing.

We focused on these three issues in Q3-Q4. 

## How to write TLA+

The learning material on TLA+ is scattered across many resources. In the
canonical book on [Specifying Systems][], Leslie Lamport is writing about TLA+
Version 1, whereas the tools support TLA+ Version 2, which introduced recursive
operators and lambdas. Moreover, the resources on
learning TLA+ are too focused on the mathematical principles of the language.
This produces lots of confusion for the newcomers and complicates the
on-boarding process.  We have started to write a new [TLA+ manual for
engineers][] and collect [TLA+ idioms][].

We have received positive feedback from our users already. We will be happy
to receive feedback from you!


## Snowcat: the new type checker for TLA+

Having seen the irritation of our users with the old type checker, we have
decided to completely rewrite it. We started by writing
[RFC001] and collecting feedback from the core developers of TLA+,
including Markus Kuppe and Leslie Lamport. The results of this discussion
materialized in [ADR002], which presents our new approach to type annotations
and the underlying type system. Jumping forward to Q1 of 2021, we have
recently introduced Java-like annotations in [ADR004][].

For example, here is a snippet from [QueensTyped.tla][] that demonstrates
the new type annotations:

```tla+
\* @type: Seq(Int) => Bool;
IsSolution(queens) ==
    \A i \in 1 .. Len(queens) - 1 : \A j \in i + 1 .. Len(queens) : 
        ~Attacks(queens,i,j) 
```

We have presented the prototype of the type checker at the TLA+ community event
in the talk called [Type inference for TLA+ in Apalache][]. In that talk,
we have also featured an approach to completely automatic type inference for
TLA+ by using SMT solvers. However, a completely automatic type inference tool
requires much more work of the Apalache development team.

You can try the new type checker [Snowcat][] right now.

## Simplified assignments

In theory, TLA+ does not have assignments by design, as the users should focus
on logical constraints instead of thinking in terms of memory and statements. In
practice, the model checker TLC interprets some expressions like `x' = 10` and
`x' \in { 1, 2, 3}` as assignments to the variable `x`.

When we started the work on Apalache back in 2016, we realized that the
practical approach of TLC is quite appealing, as the users were running TLC
against their specs. However, TLC discovers assignments while exploring the
state space. Hence, it finds assignments dynamically, as it goes. We had to
transfer this idea to static analysis. Our first solution was using SMT and it
could even find assignments that were going against the expected flow of a TLA+
formula.

Although this approach was a good solution from the academic point of view, we
found that the users were experiencing problems with understanding the error
messages that were produced by this technique. Moreover, the tool was producing
flaky results, as the SMT solvers are not guaranteed to give us the same
solution every time.

In Q4 of 2020, we had decided that less is more! The new version of Apalache
follows pretty much the same approach as in TLC to finding assignments.
However, Apalache finds assignments statically. Though in theory it means
that Apalache can reject some specs that TLC would have accepted, in practice
it works just fine. You can check the details in the manual chapter on
[Assignments in Apalache][].


# Our goal in Q1 of 2021: Alpha Centauri

In Q1 of 2021, we have been preparing for our first Alpha release, which we
call *Alpha Centauri*. So far, Apalache has been labelled as experimental. We
were breaking lots of things and tried different approaches to model checking
of TLA+. Now it is time to introduce some stability.

We have switched from a sporadic release schedule to weekly releases (actually,
we had no release schedule). This helps us to get user feedback faster.
Moreover, should we break a fresh release, users always have access to a
whole range of more stable versions.

The final challenge before issuing Alpha Centauri is to integrate the types
computed by the new type checker [Snowcat][] into the model checker.

You can track our progress towards the alpha release by checking the issues
that are tagged with [Alpha
Centauri](https://github.com/informalsystems/apalache/issues?q=is%3Aopen+is%3Aissue+label%3A%22Alpha+Centauri%22).

In the meantime, take [Apalache][] for a spin and [let us know what you
think][Chat]! If you're new to TLA+, be sure to read our [TLA+ manual for engineers][].


[TLA+]: http://lamport.azurewebsites.net/tla/tla.html
[Apalache]: http://apalache.informal.systems/
[TLAPS]: https://tla.msr-inria.inria.fr/tlaps/content/Home.html
[SMT solvers]: https://en.wikipedia.org/wiki/Satisfiability_modulo_theories
[factorization.tla]: https://github.com/informalsystems/apalache/blob/4bb5ea2d771be6a33db12cafb34ac3c362eca3a3/test/tla/factorization.tla
[TLA+ manual for engineers]: https://apalache.informal.systems/docs/lang/index.html
[Specifying Systems]: http://lamport.azurewebsites.net/tla/book.html?back-link=learning.html#book
[TLA+ idioms]: https://apalache.informal.systems//docs/idiomatic/index.html
[RFC001]: https://github.com/informalsystems/apalache/blob/unstable/docs/internal/rfc/001rfc-types.md
[ADR002]: https://apalache.informal.systems//docs/adr/002adr-types.html
[ADR004]: https://apalache.informal.systems//docs/adr/004adr-annotations.html
[Snowcat]: https://apalache.informal.systems//docs/apalache/typechecker-snowcat.html
[QueensTyped.tla]: https://github.com/informalsystems/apalache/blob/0b5d842a907d9e2a12954d4c8e2c216441ae2058/test/tla/QueensTyped.tla
[Type inference for TLA+ in Apalache]: https://youtu.be/hnp25hmCMN8
[Assignments in Apalache]: https://apalache.informal.systems/docs/apalache/assignments.html
[release of Apalache]: https://github.com/informalsystems/apalache/releases
[Chat]: https://informal-systems.zulipchat.com/#narrow/stream/265309-apalache
[Talk at Interchain Conversations]: https://www.crowdcast.io/e/interchain-conversations-II/38
[widely adopted]: https://github.com/ligurio/practical-fm
[Model Based Testing]: /2021/03/08/mbt-update/
