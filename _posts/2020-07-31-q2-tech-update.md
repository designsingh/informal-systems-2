---
layout: post
title: "Q2 2020 Technical Progress Update"
author: Ethan Buchman 
---

Since our [last technical update](https://informal.systems/2020/05/07/q1-tech-update/),
Informal Systems has continued to play a major role in the [Cosmos
project](http://cosmos.network/),
focusing primarily on protocol formalizations, TLA+ specifications, and
implementations in Rust. In addition, we're developing general purpose tools for formal
verification, and using them on the Cosmos protocols and software. 

If you're interested in our work and how it could benefit your project, [get in
touch](mailto:hello@informal.systems)!

## Contents

- [Formal Verification Tools](#formal-verification-tools)
- [Tendermint](#tendermint)
- [IBC](#ibc)
- [Research Papers and Collaborations](#research-papers-and-collaborations)
- [Organizational ("PlainText") Tools](#organizational-tools)

## Formal Verification Tools

We have been developing tools and processes in an effort to make formal verication capabilities more accessible. 

These include:

1. [VDD Guide](#vdd-guide) - a guide to Verification Driven Development (VDD)
1. [Apalache Model Checker](#apalache-model-checker) - a symbolic model
  checker for TLA+ 
1. [Model Based Testing](#model-based-testing) - Using TLA+ models to generate
  tests for Rust software
1. [Themis Tracer](#themis-tracer) - requirements tracing to track compliance
  between specs and implementations

### VDD Guide

One of our primary objectives as an organization is what we've called
Verification Driven Development, where the concerns of formal verification are integrated tightly
into the software development life cycle. VDD is still a young and evolving
process that we are discovering, defining, and refining as we gain more
experience verifying protocols and software. 

We wrote an initial [draft of a VDD guide](
https://github.com/informalsystems/vdd/blob/410e427533fcbc42426124effc305d02fa9786ba/guide/guide.md)
outlining different layers of specification and what they should contain. While
useful for clarifying our thoughts, we're deprioritizing the guide as an artifact
itself and focusing for now on our tools and their application to the real
systems we're building; [Development Driven
Verification](https://twitter.com/informalinc/status/1281656597488508928), 
if you will.

Much of our tooling revolves around TLA+, the lingua franca for distributed
systems specification. We're building the Apalache model checker for improved
verification of properties expressed in TLA+, and we're building auxilary tools to connect TLA+
specs to real software, like model based testing and requirements tracing. 

Take a look at our English and TLA+ specs in the spirit of the VDD guide for
[Tendermint](https://github.com/informalsystems/tendermint-rs/tree/master/docs/spec)
and for
[IBC](https://github.com/informalsystems/ibc-rs/tree/master/docs/spec).

### Apalache Model Checker

Informal Systems has been actively developing
[Apalache](http://github.com/informalsystems/apalache), a symbolic model
checker for TLA+, with a focus on usability and integration with modern software 
development practices. Apalache grew out of [years of research on formally
verifying distributed systems](https://forsyte.at/research/apalache/).

Much of our focus over the past six months has
been on transitioning Apalache from an academic project to an industrial one,
and using it to verify the software and protocols we're developing.
We made major progress towards this goal with the [v0.6.0 release from
February](https://github.com/informalsystems/apalache/releases/tag/v0.6.0), 
and with the new
[v0.7.0](https://github.com/informalsystems/apalache/releases/tag/v0.7.0) 
release this July.
The latest release has major usability improvements, 
including better integration with existing TLA+ tools, 
and support for JSON exports to enable model-based testing.

We've been using Apalache to verify properties of
Cosmos protocols. In doing so, we have pushed the boundary of TLA+ specifications
that can be verified. Not only is Apalache more performant than TLC (the default model
checker for TLA+) in many cases, but there are an increasing number of cases where TLC
failed to complete verification all together (running out of time or memory), 
while Apalache was able to succeed. This is largely due to Apalache's symbolic representation of the system, which
allows it to leverage an SMT solver (ie. Z3) for the actual verification work.
In contrast, TLC is an explicit state model checker that enumerates over all
states, which can quickly become infeasible.

As we continue to write specifications, we continue to improve Apalache's
capabilities, performance, and usability. Active areas of research to improve 
Apalache's capabilities include automated
abstraction and quantified SMT encodings. 

### Model Based Testing

As an extension of Apalache's usability and a way to integrate model-checking
more directly with real software, we have been using
Apalache for model-based testing of implementations. This allows
us to generate test cases for the software directly from the TLA+ specification,
greatly augmenting manually created test cases with automatically generated ones
derived from a formal model.

We have begun with the Tendermint light client, where we already have a
complete, verified specification. Here, traces output by the model checker are 
used to generate concrete data structures (eg. signed headers and validator
sets) that are then fed to the implementation to ensure it executes correctly on 
challenging input sequences.
As the implementation data structures contain more details than the specification data structures, 
the testing tool has to produce meaningful inputs to fill the gap. 

### Themis Tracer

As we write specifications, we make extensive use of identifiers to reference
definitions and properties. While these identifiers can be used as links in English
specifications (eg in Markdown) for quick reference, they cannot easily be used
across documents, for instance across the English, TLA+, and Rust implementation.
This poses a significant challenge and opportunity in ensuring that these
specs and implementations are in sync.

To address this, we have started working on a "tracer" tool, which tracks
identifiers across documents, ensuring, say, that identifiers defined in an English
specification are implemented in a TLA+ specification and/or a Rust
implementation. This can become part of a continuous integration pipeline to help
ensure that various specifications and implementations stay in sync. While this tool is
currently experimental, such a tool could greatly facilitate VDD by lowering 
friction to tracking compliance between specs and code.

The tool is called [Themis
Tracer](https://github.com/informalsystems/themis-tracer), though it is still a
private prototype and has yet to be used with real specs. Once it is useful, it
will be open sourced.

## Tendermint

We continue to work closely with the [Tendermint Go](https://github.com/tendermint/tendermint) team
on implementing protocol changes and improvements to Tendermint, and play an active role in their security
review and response process. But we've been focused primarily on light clients:
[formal specification](https://github.com/informalsystems/tendermint-rs/tree/master/docs/spec/lightclient) 
and their 
[implementation in
Rust](https://github.com/informalsystems/tendermint-rs/tree/master/light-client).

Light Clients enable light weight synchronization with blockchains and 
form the foundation for cross-chain protocols like IBC. 
The Tendermint Go 
team wrote up a great [overview of light clients and the Go implementation 
](https://medium.com/tendermint/everything-you-need-to-know-about-the-tendermint-light-client-f80d03856f98).

We just released an alpha version of a [full-featured light node in
Rust](https://crates.io/crates/tendermint-light-node). 
Give it a whirl and let us know what you think!

We also completed formalizing the core 
[commit verification protocol](https://github.com/informalsystems/tendermint-rs/tree/master/docs/spec/lightclient),
including TLA+ specifications and model-checking, and submitted a paper on our
work to the upcoming ACM AFT conference. 
If you're interested in this kind of formalization work for your project's protocols, 
[contact us](mailto:hello@informal.systems)!

We're still working on formalizing other components of the light client,
like fork detection, evidence submission, and fork accountability, and paying
special attention to their use in IBC. For instance we [formalized the Tendermint
consensus protocol in
TLA+](https://github.com/informalsystems/verification/pull/13) 
with an inductive invariant proving that a fork can only be
caused by certain kinds of behaviour.

We've also been collaborating on Tendermint protocols with a number of other researchers
that received funding from the [ICF](https://interchain.io), including:

- [Giuliano Losa](https://www.losa.fr/) at [Galois](https://galois.com/), 
  formalizing Tendermint consensus and fork
  accountability using the [Ivy](https://www.microsoft.com/en-us/research/project/ivy/) 
  verification tool.
- [Viktor Kuncak's](https://lara.epfl.ch/~kuncak/) lab at [EPFL](https://www.epfl.ch/en/),
  implementing a verifiable Tendermint [light client in Scala using
  Stainless](https://github.com/OStevan/Light-Client-Stainless).
- [Rachid Guerraoui's](https://lpdwww.epfl.ch/rachid/) lab at [EPFL](https://www.epfl.ch/en/),
  on the design of fork accountability protocols
- [Fernando Pedone's](https://www.inf.usi.ch/faculty/pedone/) lab at [USI](https://www.usi.ch/en),
  designing better protocols for synchronizing merkle trees and for utilizing gossip
  in consensus algorithms.
  
## IBC 

The [InterBlockchain Communication (IBC) protocol](https://cosmos.network/ibc/) being spearheaded by the 
Cosmos project is a robust foundation for general purpose communication between blockchains.
We continue to participate in developing the [English
specifications](https://github.com/cosmos/ics) for IBC, and are working towards
[complete formalization of the IBC protocol in TLA+](https://github.com/informalsystems/ibc-rs/tree/master/docs/spec),
including the client, connection, channels, packets, and the relayer.
We occasionally [uncover bugs as we go](https://github.com/informalsystems/ibc-rs/issues/61).
Our overall goal is to improve accessibility and comprehension of the IBC protocol.

So far we have TLA+ specs and some verified properties for the relayer, client updates,
connection handshake, channel handshake, and channel closing.
We're still working on packets, and improved modeling and verification of all the components.
We plan to use these TLA+ specs for model-based testing of actual IBC
implementations (eg. in Go, Rust, Javascript, etc.)

We have also begun work towards an implementation of [IBC in
Rust](https://github.com/informalsystems/ibc-rs), 
including both an on-chain IBC module and a relayer.
While still in a nascent phase, we expect to see significant progress
over the coming months, especially as the Cosmos-SDK stabilizes towards the
Stargate release.

## Research Papers and Collaborations

Members of our team published or submitted for publication sixteen (16) 
academic papers over the last 6 months on topics at the intersection of
distributed systems and formal verification, including three specifically
on our work formalizing Tendermint protocols. Many of the papers are in collaboration
with researchers at [TU Wien](https://www.tuwien.at/en/), [EPFL](https://www.epfl.ch/en/), [INRIA](https://www.inria.fr/en), [USI](https://www.usi.ch/en), and others.

Since many of these papers are still under review, we cannot reference them
explicitly here, though we will highlight our paper at 
[FMBC2020](https://easychair.org/smart-program/FMBC2020/2020-07-21.html#talk:156824):
_Formal Specification and Model Checking of the Tendermint Blockchain Synchronization Protocol_.
where we document how we applied the VDD process to one of Tendermint's subprotocols,
and what we learned from it. The [presentation](https://www.youtube.com/watch?v=h2Ovc1KWlXM)
gives a great overview!

We are working on keeping an updated list of all papers published by members of our team on
our website, so check back in soon!

## Organizational Tools

Besides our work on formal verification, Tendermint, and IBC,
we're still committed to building open-source tools that simplify the management of
companies themselves - formal verification for corporate minute books, if you
will.  

Our first product in this direction is the [Themis
Contract](https://github.com/informalsystems/themis-contract) tool for 
drafting, templating, versioning, and signing contracts from the command line.
Themis Contract grew out of our frustration with the complexity of managing a
company's legal contracts and tracking changes to templates and different
instantiations. It leverages git for versioning and
[dhall](http://dhall-lang.org/) for contract configuration,
and we're using it now for our contractor and employment agreements. The latest
release is a re-write in Go of the original prototype. If you're
interested in bringing the power of open-source software development paradigms
to law and corporate management, give [Themis
Contract](https://github.com/informalsystems/themis-contract) a spin!

We've also been working on a system for corporate processes that involve
candidate applications, like grant programs and hiring pipelines. The goal
is to build a flexible and open alternative to the current web of proprietary services 
companies use for these processes. Our current prototype design
routes a Google Form filled out by a candidate to an AWS Lambda that triggers the creation of 
a templated Gitlab repository with all the candidate's info. The git repo then serves
as a "candidate package", a home for notes, emails, and decision making related
to that candidate. As part of this, we built tools for downloading and syncing entire Gitlab trees (many 
repositories at once), and for synchronizing files between Google Drive and
Gitlab repositories. While the system was being utilized for the 
[ICF funding program](https://interchain.io/funding/)  and for our 
[internal hiring pipeline](https://informal.systems/careers),
we are de-prioritizing further development and open-sourcing 
for the time being while we focus on Tendermint and IBC. If you're eager to get
access to any of these tools sooner, [contact us](mailto:hello@informal.systems)!

## Outlook

In the coming months,
we expect to be wrapping up our work on 
[Tendermint light
clients](https://github.com/informalsystems/tendermint-rs/tree/master/light-client),
fleshing out our implementation of [IBC in Rust](https://github.com/informalsystems/ibc-rs), 
and making more extensive use of
model-based testing on our code. To stay in-touch, 
and keep up with our mission of verifiable distributed systems and organizations,
subscribe to our [newsletter](https://informal.systems/index.html#newsletter) and follow us on 
[twitter](https://twitter.com/informalinc).
