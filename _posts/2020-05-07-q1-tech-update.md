---
layout: post
title: "Q1 2020 Technical Progress Update"
author: Ethan Buchman 
---

Since [spinning out from the
ICF](https://informal.systems/2020/02/24/introducing-informal/) at the start of the year, we've been hard at
work on a number of projects aligned with our mission of **verifiable distributed 
systems and organizations**. Here we'll provide an update on each of them.

## Contents

- [Verification Driven Development](#verification-driven-development)
- [Tendermint Fast Sync](#tendermint-fast-sync)
- [Tendermint Light Client](#tendermint-light-client)
- [IBC Connection and Relayer](#ibc-connection-and-relayer)
- [Apalache - Symbolic Model Checker for
  TLA+](#apalache---symbolic-model-checker-for-tla)
- [PlainText Tooling](#plaintext-tooling)
- [Research Collaborations](#research-collaborations)

## Verification Driven Development

A primary focus of our efforts at Informal is to define an explicit *process* for 
engineering distributed systems that involves specification, verification, and
implementation in a co-ordinated manner. We believe that specification and
verification should not be an after thought, but should be built into the
architecture itself. We call this approach "Verification Driven Development"
(VDD).

Formal verification techniques are rapidly maturing. 
Model checking with TLA+ has been taken up
[across AWS engineering
teams](https://blog.acolyer.org/2014/11/24/use-of-formal-methods-at-amazon-web-services/).
Theorem proving is being used to [secure operating
systems](https://www.sigops.org/s/conferences/sosp/2009/papers/klein-sosp09.pdf) and 
[compilers](http://compcert.inria.fr/research.html). Compilers and static analysis tools are
catching an increasing scope of real program bugs.

In the long term, we suspect that VDD will include a careful mix of these 
different approaches to verification. In the short term, we're focused on 
specification and model checking with TLA+. We're also developing our own model
checker for TLA+, called [Apalache](https://github.com/konnov/apalache), to overcome limitations with the
default model checker, TLC.

In a future blog post, we will go into much more detail about why we've
chosen to focus on model checking, how we foresee TLA+ models being
integrated with actual code, and what role other verification techniques will
play.

In the meantime, we're developing a
[template guide](https://github.com/informalsystems/VDD/blob/master/guide/guide.md)
for writing English and TLA+
specs for distributed systems protocols and implementations. The guide is in an
early prototype phase and will be revamped and improved as we integrate it into our own
specification, verification, and implementation efforts. We hope it will be useful to 
others in their efforts to employ more rigorous development processes.

## Tendermint Fast Sync

In the past, Informal Systems engineers have played pivotal roles in the
[Tendermint Core](https://github.com/tendermint/tendermint) codebase. 
While Tendermint Core is the world-leading implementation of Byzantine Fault Tolerant consensus, 
aspects of its architecture have made it difficult to test, maintain, improve, and verify the core 
protocols. We designed a simplified architecture, based on finite state machines with less concurrency,
and implemented it for the Fast Sync protocol, or "blockchain reactor", which
enables new nodes, or a node that has been offline for a while,
to quickly download all the missing blocks. The new implementation is dubbed [v2](https://github.com/tendermint/tendermint/tree/master/blockchain/v2).

As part of this effort, we wrote a detailed English and
TLA+ specification for the Fast Sync protocol that can be found
[here](https://github.com/informalsystems/tendermint-rs/tree/master/docs/spec/fastsync).
The specification was written according to the VDD guidelines, and basic
verification was completed. In performing this work, we discovered a
vulnerability in the protocol and proposed a straight forward fix.

If you are designing and/or implementing a distributed systems protocol, please
[get in touch with us](mailto:hello@informal.systems) - we'd love to discuss how we can help you with similar
kinds of analysis. 

## Tendermint Light Client

Informal Systems has taken over maintenance of the
[tendermint-rs](https://github.com/informalsystems/tendermint-rs)
library, originally developed by Tony Arcieri as part of the [Tendermint
KMS](https://github.com/iqlusioninc/tmkms). We plan to build out a complete implementation of the Tendermint 
system over two years, starting with the Light Client. The Light Client is a
protocol for securely syncing with the blockchain using a minimal amount of
information. It is the foundation of the [IBC
protocol](https://cosmos.network/ibc) for secure
communication between two blockchains.

Last year, members of our team researched the light client, establishing a
taxonomy of attacks and discovering new ones. We have since written
[TLA+
specifications](https://github.com/informalsystems/verification/blob/develop/spec/light-client/Lightclient.tla) 
for the light client, performed some initial verification, and completed an [initial
implemention](https://github.com/informalsystems/tendermint-rs/tree/master/light-node) in Rust. 
We are currently reworking both the specification
and the implementation to improve their verifiability.

We also spent some time over the past few months cleaning up the `tendermint-rs` repository 
and updating it for compatibility with the latest version of Tendermint Core.
If you're interested in interacting with Tendermint components in Rust, please
[check it out!](https://github.com/informalsystems/tendermint-rs).

## IBC Connection and Relayer

The InterBlockchain Communication protocol, or IBC, is the hallmark of the
Cosmos Network, allowing arbitrary blockchains to communicate with one another.
Over the last year, members of our team played a significant role in developing
the [English specification](https://github.com/cosmos/ics) of IBC. While there is now a functioning
[implementation of IBC in
Golang](https://github.com/cosmos/cosmos-sdk/tree/master/x/ibc), we have begun an effort to formally
specify the protocol in TLA+, and to implement it in Rust.

IBC can be thought of as mostly analogous to TCP, which underlies the modern
internet. Like computers using TCP, blockchains using IBC can establish
connections to one another over which they can communicate by sending packets.
While TCP operates over a network of routers connected via the physical
infrastructure of the internet, IBC operates over a set of **relayers**, nodes
which monitor the blockchains and relay packets (and proofs) from one blockchain
to another.

We have begun with TLA+ specifications of the [connection
handshake](https://github.com/informalsystems/ibc-rs/pull/58) and
the
[relayer](https://github.com/informalsystems/ibc-rs/tree/master/verification/spec/relayer). 
We hope that this effort will help put the IBC protocol
on a more formal footing, making it more accessible and appealing to other
organizations and researchers.

We're also working towards a full [implementation of a
relayer](https://github.com/informalsystems/ibc-rs) in Rust, 
to complement the one [developed by the Iqlusion team in
Go](https://github.com/iqlusioninc/relayer). 
In the longer term, we expect to implement the complete IBC protocol in Rust,
enabling Cosmos applications written in Rust to benefit from interoperability
with other Cosmos blockchains.

## Apalache - Symbolic Model Checker for TLA+

Part of the power of using TLA+ to specify systems and properties is the ability to use 
the built in model checker, TLC, to exhaustively search the state space of the system
and verify its properties. While TLC has been heavily optimized over the
years, its approach of explicitly enumerating states means the run time can be
exponential in the size of the model. In practice, this means that systems can
only be verified for very small numbers (3 or 4) of nodes. 

To improve over this approach, we've been developing a symbolic model checker
for TLA+, called [Apalache](https://github.com/konnov/apalache), which can greatly accelerate certain
verification tasks. Rather than explicitly enumerate states like TLC, Apalache
translates the TLA+ specification and properties to a logic understood by Z3, the powerful SMT solver;
it uses a more symbolic representation to more efficiently explore a model and verify its properties.
For more information on how Apalache works, see the [paper](https://dl.acm.org/doi/10.1145/3360549).

Over the past few months, we've made major improvements to Apalache, culminating
in the [v0.6.0 release](https://github.com/konnov/apalache/releases/tag/v0.6.0).
Much of this work has focused on transitioning the tool from an academic project
to an industrial one - usability improvements, integration with the TLA+
toolbox, and fixes to run on real world specifications.
If you're familiar with TLA+ and frustrated with the run-times of TLC, we
encourage you to give Apalache a spin! Of course, if you run into any trouble,
please open an issue!

## PlainText Tooling

Our mission at Informal is to bring verifiability not just to distributed
systems, but also to distributed organizations. In this regard, we've been
working on tools that adopt best practices from software engineering - like 
plain text, version control, and continuous integration - and apply these practices to the
management of corporations, including our own. We refer to these efforts more
generally as PlainText Tooling, as they have as a primary focus the
representation of data in human and machine readable plaintext. Over the past few months, 
we've been working on two plaintext projects in particular. 

The first is a [tool for generating legal
contracts](https://github.com/informalsystems/themis-contract) from a plaintext template
and a parameters file. This grew out of frustration from working with Word documents and tracking changes,
both in the parameters and the templates. Our current implementation uses LaTeX as a templating
language to enable arbitrary formatting, but we're still experimenting with
markdown and its variants. The tool allows you to define a template with a set
of variables, and then to instantiate and sign a contract using the parameters
in a short TOML file. If you've ever found yourself frustrated with current
approaches to legal contracts, please check it out and provide feedback!

The second project is a grants management pipeline built on top of Gitlab,
designed primarily for use by the [Interchain Foundation](https://interchain.io/) to manage its grants
program. Our goal is to provide a low-cost and flexible solution for grant
management and other submission based processes, like hiring, that lend
themselves toward transparency and the use of open tools. While the tooling is not yet open-sourced, 
we expect to open components of it over the year. If you might be interested in using such 
a tool for your own funding program or hiring pipeline, please let us know by [emailing us](mailto:hello@informal.systems)!

## Research Collaborations

Informal Systems maintains an active research program, collaborating with leading scientists in academia
and other organizations around the world. Together, we are conducting
fundamental research at the intersection of formal verification and distributed systems.

In collaboration with researchers at [EPFL](https://www.epfl.ch/en/), we're verifying Tendermint protocols like
the light client and improving the fork accountability protocol. With researchers at [TU Wien](https://www.tuwien.at/en/), [TU Munich](https://www.tum.de/en/),
[INRIA](https://www.inria.fr/en), and the [University of Sydney](https://www.sydney.edu.au/), we're collaborating to improve techniques for model
checking Byzantine Fault Tolerant protocols. With researchers at
[USI](https://www.usi.ch/en), we're exploring gossip based consensus algorithms. And much more. We will be providing more detail on these collaborations in future blog posts. If you're interested in our research program or collaborating with Informal, please [reach out](mailto:hello@informal.systems).

## Outlook

We're excited about the early progress we've made over the last few
months and about what's ahead for the next few as we further our mission of
verifiable distributed systems and organizations. To stay in-touch, 
subscribe to our [newsletter](https://informal.systems/index.html#newsletter) and follow us on 
[twitter](https://twitter.com/informalinc).
