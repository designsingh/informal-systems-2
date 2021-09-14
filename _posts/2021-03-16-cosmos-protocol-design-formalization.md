---
layout: post
title: "Dev Update: Cosmos Protocol Design and Formalization"
author: Ethan Buchman, Zarko Milosevic, Josef Widder
featuredImage: "/img/posts/dev-update-formalization.png"
---


Large parts of the work of Informal Systems in the Cosmos ecosystem is on protocol design, specification,
and correctness. For reliable distributed systems, not all the truth lies in the code. Capturing the distributed aspects of the protocols requires a rigorous understanding of the interactions between
the code run on the different machines in a system, in particular if machines may act in an adversarial way. 
We capture these interactions in English specifications, and formalize them in TLA+. We put much effort in this work, as particular protocol bugs are hard to find on the code level. 
At the same time these bugs can be expensive in the context of adversarial environments with economic incentives.

While we are excited to add new features to the Cosmos ecosystem, we are determined to also do the unspectacular work of specifying what our systems are actually supposed to do, and to check whether they actually do that. The latter we do by manual audits (e.g., the IBC audit discussed below), and by writing TLA+ specifications that can be used for
[model-based testing](/2021/03/08/mbt-update), and model checking with [Apalache](/2021/03/08/apalache-update/).

## What's in this post

- [IBC Audit and Protocol Development](#ibc-audit-and-protocol-development)
- [Tendermint](#tendermint)

## IBC Audit and Protocol Development

IBC, the 
[InterBlockchain Communication protocol](https://cosmos.network/ibc), 
is a general purpose protocol
for message passing on channels between blockchains. Since it's release in the
[Stargate](http://stargate.cosmos.network/) upgrade, 
it is set to transform the landscape of blockchain interoperability.
Protocol design for IBC began in earnest in the summary of 2019, in the days leading up to the inaugural 
[Interchain
Conversations](https://www.youtube.com/playlist?list=PLdQIb0qr3pnC26093WyCfom9bQtVuTxCW) in Berlin. 
Led by 
[Christopher Goes](https://twitter.com/cwgoes?lang=en) at 
[Interchain GmbH](http://interchain.berlin/), 
in close collaboration with team members at 
[Informal Systems](http://informal.systems/)
and [Agoric](https://agoric.com/),
the IBC 1.0 
[specification in English](https://github.com/cosmos/ics) 
and 
[implementation in Go](https://github.com/cosmos/cosmos-sdk/tree/master/x/ibc) 
has been finalized and shipped in the Stargate upgrade.

As part of the review process in the months leading up to the Stargate release, 
Informal Systems conducted a protocol and security audit of the IBC specs and
software that revealed some issues in both the protocol and implementation, 
necessitating a number of fixes before launch. 
Notably, and contrary to an alleged tradeoff between security and convenience,
one of the security fixes actually simplified the overall UX of IBC.
You can read more about the audit report from Informal Systems
[here](https://twitter.com/informalinc/status/1351940252617814017)
and find the full report in our [audits
repository](https://github.com/informalsystems/audits/blob/main/IBC2020/report.pdf).
If you're interested in protocol and security audits, 
[contact us](mailto:hello@informal.systems).

Independently of the audit, we completed extensive formal specifications in TLA+ of both the 
[core IBC protocols](https://github.com/informalsystems/ibc-rs/tree/master/docs/spec/tla), 
including client updates, connection and channel handshakes, packet transmission, 
and the behavior of concurrent relayers,
as well as the 
[IBC fungible token transfer protocol](https://github.com/informalsystems/ibc-rs/tree/master/docs/spec/tla/fungible-token-transfer). 
The models are written in a highly modular way to facilitate future verification efforts. 
While some properties and invariants are included, we are continuing to work on them and
their verification with the [Apalache](http://apalache.informal.systems/) model checker.

In the coming months, we plan to integrate these formal specifications of IBC
into the [main IBC English specification](http://github.com/cosmos/ics), 
and to work closely with Interchain
GmbH on a refactor of the English specifications to improve their accessibility
and correctness. We are also working to leverage the TLA+ specs for 
[Model-Based Testing](/2021/03/08/mbt-update), which allows us to auto-generate complex language agnostic test sequences 
to run against any implementation of IBC. See our recent 
[blog post](/2021/03/08/mbt-update) for more about our model-based testing
tools.

Last but not least, we have been leading a collaboration with the [DCL lab at EPFL](https://dcl.epfl.ch/site/) on the design of a shared security protocol for Cosmos that will allow zones to inherit security from the Cosmos Hub. The initial version of the protocol can be found [here](https://github.com/informalsystems/cross-chain-validation/blob/main/spec/valset-update-protocol.md). We will continue this work and will further contribute our expertise (protocol design and correctness assurance) in the multi-organisational effort in order to bring shared security capabilities to the Cosmos Hub.

## Tendermint

Underlining our work on IBC is our continued work on Tendermint protocol design
and verification. We work closely with the Interchain GmbH team on the design
and extension of Tendermint protocols, and on security reviews of Tendermint in
Go.

We are currently participating in the [ABCI++ RFC](https://github.com/tendermint/spec/pull/254) that will enable a tighter integration of applications with Tendermint consensus. Once the discussions around the RFC stablizes, our goal is to formalize the API and the underlying concurrency model to ensure that Tendermint's safety and liveness is maintained.

We've also begun a code audit on evidence detection and submission in Tendermint Core. Tendermint proof-of-stake security is based on incentivizing validators to correctly execute the protocol by detection and punishing misbehavior. As a result the involved code is highly critical to ensure security.

In the latter half of 2020, we made tremendous progress in formally
verifying the safety (though not yet liveness!) of the Tendermint consensus and light client protocols. 
The core Tendermint consensus protocol is formalized in both
[TLA+](https://github.com/tendermint/spec/tree/2f590a6/rust-spec/tendermint-accountability)
and in 
[Ivy](https://github.com/tendermint/spec/tree/66e9106/ivy-proofs), 
with a focus on its safety and fork accountability.
While the TLA+ work was done in-house, the Ivy work was done by [Giuliano Losa](https://www.losa.fr/) of [Galois](https://galois.com/)
with funding from the [Interchain Foundation](http://interchain.io/). 
The Ivy proofs were done for an arbitrary number of validators. 
The TLA+ specification was checked with [Apalache](https://apalache.informal.systems/) for several configurations, where the number of validators was fixed,
though by leveraging Apalache we were able to define an inductive invariant that
could thus be checked for arbitrary length executions of the protocol.
While Ivy was designed for this sort of high level reasoning about protocol properties (and
less for detailed specifications of a protocol), TLA+, as a specification
language, is less well equipped through its model checker for high-level reasoning 
about parameterized protocol properties. However, by making use of [Apalache](http://apalache.informal.systems/), our
in-house TLA+ model checker, we're able to verify much more advanced properties.

The fork accountability properties that were verified are particularly useful for reasoning about
what happens if +1/3 of validators are malicious during consensus and cause a fork - they
guarantee that, so long as +1/3 validators are behaving correctly, 
each of the malicious validators can be identified as having executed one of two 
possible attack tactics (so-called "equivocation" and "amnesia"), and can thus 
be punished.

We also produced specifications for the current versions of the Tendermint light client 
protocols completely in TLA+,
including protocols for fork detection and accountability. A detailed account of our
formalization of the core light-client verification
protocol and our model checking results is now 
[published on the arxiv](https://arxiv.org/abs/2010.07031). The detection and 
accountability can be found on 
[github](https://github.com/tendermint/spec/tree/master/spec/light-client).
We are continuously reviewing and analyzing these specifications.


Finally, as part of our collaboration with [Professor Pedone’s lab at USI](https://www.inf.usi.ch/faculty/pedone/) we have contributed to two Tendermint related papers that are currently under submission. 

## Up Next

We're continuing our work on formally specifying and verifying protocols in the
Cosmos ecosystem, and helping to improve correctness assurance for the software.
We're especially focused now on some of the up coming protocol design in Tendermint
(ABCI++) and IBC (shared security!), and on applying our new [Model Based
Testing](/2021/03/08/mbt-update) tools to existing code. We're also continuing
to conduct audits, especially for Cosmos projects. If you're interested in an
audit, or in any of our formal verification services, please don't hesitate to [reach out](mailto:hello@informal.systems)!
