---
layout: post
title: "Q3/Q4 2020 Technical Progress Update"
author: Ethan Buchman
published: false
---

It's been almost half a year since our 
[last technical update](https://informal.systems/2020/07/31/q2-tech-update/).
We've been hard at work on IBC protocol security and Rust implementation
stability for Cosmos, among other things. 
Notably, we now have a 
[complete TLA+ specification of the IBC protocol](https://github.com/informalsystems/ibc-rs/tree/master/docs/spec/tla/ibc-core) (!), 
a 
[Stargate](https://stargate.cosmos.network/)-compatible 
[IBC Relayer in Rust](https://github.com/informalsystems/ibc-rs/),
and have completed an 
[extensive audit of the
IBC](https://github.com/informalsystems/audits/tree/main/IBC2020#ibc-audit-2020)
english specification and implementation in Go. 
Stargate and IBC launch look to be just around the corner.
 
If you're interested in protocol and security audits, 
especially for consensus protocols, light-clients, or blockchain bridges,
[get in touch](mailto:hello@informal.systems)! 
For more details on what we worked on in the latter half of 2020, read on below!

## Contents

- [IBC Audit and Protocol Development](#ibc-audit-and-protocol-development)
- [IBC in Rust](#ibc-in-rust)
- [Tendermint](#tendermint)
- [Formal Verification Tools](#formal-verification-tools)
- [Research Papers and Collaborations](#research-papers-and-collaborations)
- [Organizational ("PlainText") Tools](#organizational-tools)

## IBC Audit and Protocol Development

IBC, the 
[InterBlockchain Communication protocol](https://cosmos.network/ibc), 
is a general purpose protocol
for message passing on channels between blockchains. It is set to transform the
landscape of blockchain interoperability when it launches in 2021.
Protocol design for IBC began in earnest in the summary of 2019, in the days before the innaugral 
[Interchain
Conversations](https://www.youtube.com/playlist?list=PLdQIb0qr3pnC26093WyCfom9bQtVuTxCW) in Berlin. 
Led by 
[Christopher Goes](https://twitter.com/cwgoes?lang=en) at 
[Interchain GmbH](http://interchain.berlin/), 
with support in partciular from team members at 
[Informal Systems](http://informal.systems/)
and [Agoric](https://agoric.com/),
the IBC 1.0 
[specification in English](https://github.com/cosmos/ics) 
and 
[implementation in Go](https://github.com/cosmos/cosmos-sdk/tree/master/x/ibc) 
has been finalized 
following the recent completion of protocol security audits by the internal development 
team at Interchain GmbH and by a team at Informal Systems.

The Informal Systems protocol and security audit revealed a number of 
issues in both the protocol and implementation, necessitating a number of fixes before
launch. Notably, contrary to an alleged tradeoff between security and convenience,
one of the security fixes actually simplified the overall UX of IBC.
You can read more about the audit report from Informal Systems
[here](https://twitter.com/informalinc/status/1351940252617814017).
If you're interested in protocol and security audits, 
[contact us](mailto:hello@informal.systems).

Independently of the audit, we completed extensive formal specifications in TLA+ of both the 
[core IBC protocols](https://github.com/informalsystems/ibc-rs/tree/master/docs/spec/tla), 
including client updates, connection and channel handshakes, packet transmission, 
and the behaviour of concurrent relayers,
as well as the 
[IBC fungible token transfer protocol](https://github.com/informalsystems/ibc-rs/tree/master/docs/spec/tla/fungible-token-transfer). 
The models are written in a highly modular way to facilitate future verification efforts. 
While some properties and invariants are included, we are continuing to work on them and
their verification with the [Apalache](http://apalache.informal.systems/) model checker.

In the coming months, we plan to integrate these formal specifications of IBC
into the [main IBC English specification](http://github.com/cosmos/ics), 
and to work closely with Interchain
GmbH on a refactor of the English specifications to improve their accessibility
and correctness. We are also working to leverage the TLA+ specs for Model-Based
Testing, which will allow us to auto-generate complex language agnostic test sequences 
to run against any implementation of IBC. For more about our model-based testing
tools, see below under [Tendermint](#tendermint) and [Verification
Tools](#formal-verification-tools).

Last but not least, we have been leading a collaboration with the LPD lab at EPFL on the design of the cross-chain security protocol. The initial version of the protocol can be found [here](https://github.com/informalsystems/cross-chain-validation/blob/main/spec/valset-update-protocol.md). We will continue this work and will further contribute our expertise (protocol design and correctness assurance) in the multi-organisational effort in order to bring cross-chain security capability to the Cosmos Hub. 

## IBC in Rust

We've made substantial progress on our Rust implementation
of the IBC handlers and relayer. An [initial version of the relayer](https://github.com/informalsystems/ibc-rs/tree/master/relayer-cli).
is ready and working against the Stargate release. It comes with a CLI for all IBC transaction types
and can run as a service to relay all IBC client, handshake, and packet messages
between two chains. 
[Try it out](https://github.com/informalsystems/ibc-rs/tree/master/relayer-cli)
and let us know what you think! 

While there is still a lot of work ahead to improve its
capabilities and production quality, the most arduous task of replacing Amino
with Protofobuf and getting all the Rust types working with Stargate is now behind us. You can
read more about our efforts in the Stargate upgrade in the [Cosmos
blogpost](https://blog.cosmos.network/how-seven-teams-collaborated-to-deliver-the-biggest-software-upgrade-in-the-cosmos-universe-2288f4f9afe8). 

On the IBC handlerss front, the Rust handlers for clients and connections are
complete, and work has begun on channels and packets. Our handlers will make it 
easy for any blockchain application built in Rust to integrate IBC and connect
into the internet of blockchains. Initial framework's being targetted include
[Parity's Substrate](https://github.com/cdot-network/substrate-ibc) and [Nomic's Orga](https://github.com/nomic-io/orga).


## Tendermint

Underlining our work on IBC is our continued work on Tendermint, 
playing both a supporting role for the Tendermint in Go team and a leading
role in the development of Tendermint in Rust.
On the Go side, we continue to participate in code review and architecture
design, most recently with a focus on the light client and evidence handling
logic, and the long-awaited, upcoming P2P refactor.

On the Rust side, we've been mostly occupied with the Stargate upgrade,
which consists primarily of replacing Amino with Protocol Buffers. This was a
heavy lift for 
[teams across the entire Cosmos ecosystem](https://blog.cosmos.network/how-seven-teams-collaborated-to-deliver-the-biggest-software-upgrade-in-the-cosmos-universe-2288f4f9afe8) 
but we're excited to report that it's basically complete - 
[`tendermint-rs`](https://github.com/informalsystems/tendermint-rs)
is Stargate compatible.

A big part of that work for us involved a more systematic approach to the
problem of serialization in a codebase, effectively separating data types used
for serialization from those used for logical operations and to model the domain. 
The former are generated from protobuf files and live in their own
`tendermint-proto` crate. 
The latter "Domain Types" are the core types of the `tendermint` crate and are
designed to be correct by construction. See the 
[`Protobuf`](https://github.com/informalsystems/tendermint-rs/blob/43bba96/proto/src/domaintype.rs) 
trait for more details.

There's been a number of other improvements to `tendermint-rs`, especially in the websocket 
client and light client. The prototype websocket client
was rebuilt to be more robust and support greater functionality and control,
including filtered subscriptions and support for all Tendermint RPC requests
over the websocket. Support for compiling the light client to WASM was greatly
improved and is now targeting integration in
[CosmJS](https://github.com/cosmos/cosmjs), 
the premier client library for interacting with Cosmos chains, built by the team at [Confio](https://confio.tech/).
The light client has also served as testbed for building out our Model Based
Testing tools for automated test generation from formal TLA+ models of the
protocol. As we now have quite complete TLA+ specs for the light client, we have
been auto-generating language agnostic JSON test cases for light client
validation criteria and have integrated these tests into both the Go and Rust
light client codebases! More details on [Model Based
Testing](#formal-verification-tools) below.

On the formal verification front, we made tremendous progress in formally
verifying the Tendermint consensus and light client protocols. The core
Tendermint consensus protocol is now described completely in 
[TLA+](https://github.com/tendermint/spec/tree/2f590a6/rust-spec/tendermint-accountability)
and in 
[Ivy](https://github.com/tendermint/spec/tree/66e9106/ivy-proofs), 
complete with formal proofs in both languages for its safety and fork accountability properties.
While the TLA+ work was done in-house, the Ivy work was done by [Giuliano Losa](https://www.losa.fr/) of [Galois](https://galois.com/)
with funding from the [Interchain Foundation](http://interchain.io/). 
Notably, both proofs apply for an arbitrary number of validators. 
While Ivy was designed for this sort of high level reasoning about protocol properties (and
less for detailed specifications of a protocol), TLA+, as a specification
language, is less well equipped through its model checker for high-level reasoning 
about parameterized protocol properties. However, by making use of [Apalache](http://apalache.informal.systems/), our
in-house TLA+ model checker, we're able to verify much more advanced properties.

The fork accountability properties that were verified are particularly useful for reasoning about
what happens if +1/3 of valdiators are malicious and cause a fork - they
guarantee that, so long as +1/3 validators are behaving correctly, 
each of the malicious validators can be identified as having executed one of two 
possible attack tactics (so-called "equivocation" and "amnesia"), and can thus 
be punished.

We also completed specifications for the Tendermint light client protocol completely in TLA+,
including protocols for fork detection and accountability. A detailed account of our
formalization of the core light-client protocol and our model checking resuilts is now 
[published on the arxiv](https://arxiv.org/abs/2010.07031). The detection and accountability can be found on [github]().
This work significantly boosts confidence in the security of these core
protocols.

Finally, as part of our collaboration with [Professor Pedone’s lab at USI](https://www.inf.usi.ch/faculty/pedone/) we have contributed to two Tendermint related papers that are currently under submission. 

## Formal Verification Tools

We're committed to making formal verification more accessible to everyday
developers, and integrating it into the regular software development workflow. 
TLA+ is a tried and tested and widely adopted language for specifying systems,
but the tooling around it is stuck in the 90s, and the verification capabilities
are limitted. Our research team has been actively developing
[Apalache](http://apalache.informal.systems/),
a symbolic model checker for TLA+. Apalache brings TLA+ into the 21st century with much improved
developer experience, many orders of magnitude improvements in model
checking, and extensions, like "Model Based Testing", for integrating TLA+
specifications with real code.

Much of the focus of the past six months has been on
improving the stability and usability of the model checker and TLA+ itself. After receiving
feedback from our internal users at Informal Systems, we focused on three major
issues:

1. **Improving the type checker**. We introduced a new approach to type annotations and a new type checker to
   greatly improve type annotations and error messages, improving the user
   experience. The new checker finds types by unification and equation
   solving, and infers a larger set of types automatically.
2.  **Improving the assignment solver**. While TLA+ as a language does not have
    the notion of assignments, it can be helpful to users to still label certain
    expressions as assignments. Our previous assignment solver, though quite
    general, was complex and difficult to explain. The new version sacrifices
    some generality for a simpler solver that is more predictable and easier to
    understand.
3.  **Language documentation**. Experience has shown that the resources on
    learning TLA+ are too focused on the mathematical principles of the languages, which
    complicates the onboarding process. We have started to develop a new
    [language manual on TLA+](https://apalache.informal.systems/docs/index.html) that should be more accessible to system engineers.

We're also developing "Model Based Testing" (MBT) tools around Apalache,
allowing us to auto-generate tests for real implementations (eg. in Go or Rust) from
the underlying TLA+ model. Model based testing matured significantly in the last six months: it is now
part of the light client test suits (part of CI), both in
[Rust](https://github.com/informalsystems/tendermint-rs/tree/v0.17.1/light-client/tests/support/model_based)
and [Go](https://github.com/tendermint/tendermint/tree/v0.34.3/light/mbt)
implementations. Light client model-based tests are derived from the TLA+ model
of the Light Client. The tests themselves are simple TLA+ assertions, that
describe the desired shape of the Light Client execution; see
[LightTests.tla](https://github.com/informalsystems/tendermint-rs/blob/v0.17.1/light-client/tests/support/model_based/LightTests.tla))
for some examples. Expressing test scenarios as TLA+ assertions allows
capturing very complex scenarios with just a few lines of high level TLA+ logic.
MBT contains also basic fuzzing functionalities which allows more complex
test scenarios compared to the traditional fuzzing libraries, as corrupted
data structures can be injected as part of the non-trivial scenarios defined
with TLA+ assertions.

MBT has already proved itself by catching several bugs, both in the light client
Rust implementation
([#650](https://github.com/informalsystems/tendermint-rs/issues/650),
[#637](https://github.com/informalsystems/tendermint-rs/issues/637) and
[#579](https://github.com/informalsystems/tendermint-rs/issues/579)) and in the
[IBC implementation in Go](https://github.com/cosmos/cosmos-sdk/issues/8120).
In coming months, we plan to further improve developer experience of MBT so
that development and maintenance of MBT tests can be under responsibility of
the corresponding development teams. There is a clear interest from core Cosmos
development teams to further expand their test suits using MBT.

If you're interested in Model Based Testing for your own system, [get in
touch!](mailto:hello@informal.systems)! 

## Research Papers, Presentations, and Collaborations

Members of the Informal Systems team published a number of academic papers over the last 6 months.
These papers include: 

- [Igor Konnov, Marijana Lazic, Ilina Stoilkovska, Josef Widder: Survey on
  Parameterized Verification with Threshold Automata and the Byzantine Model
  Checker. CoRR abs/2011.14789 (2020)](https://arxiv.org/abs/2011.14789)
- [Ilina Stoilkovska, Igor Konnov, Josef Widder, Florian Zuleger: Eliminating
  Message Counters in Threshold Automata. ATVA 2020: 196-212. Pre- sented by
  Ilina Stoilkovska at ATVA
  2020.](https://link.springer.com/chapter/10.1007/978-3-030-59152-6_11)

Additionally, members of our team have given technical talks at various events
including: 

- [Formal Specification and Model Checking of the Tendermint Blockchain
  Synchronization Protocol](https://www.youtube.com/watch?v=h2Ovc1KWlXM&t=3s).
  Igor Konnov, Josef Widder, Zarko Milosevic. FMBC 2020, July 2020.  
- [Model-Based Testing with TLA+ and
  Apalache](https://www.youtube.com/watch?v=aveoIMphzW8). Andrey Kuprianov and
  Igor Konnov. TLA+ Community Event, October 2020.  
- [Time preference, IBC & the Era of
  Coordination](https://www.crowdcast.io/e/interchain-conversations-II/8). Sean
  Braitwaite. Interchain Conversations, December 2020. 
- [Model-based Quality Assurance of Tendermint and IBC Implementations in Rust
  & Go](https://www.crowdcast.io/e/interchain-conversations-II/9). Interchain
  Conversations, December 2020. 
-  [How TLA+ and Apalache Helped Us to Design the Tendermint Light
   Client](https://www.crowdcast.io/e/interchain-conversations-II/38).
   Interchain Conversations, December 2020. 

We also gave a number of less technical, but certainly no less entertaining,
talks at some virtual conferences:

- Chainsafe? Cosmos talks? 

## Organizational Tools

Informal is a new kind of company, built on co-operative principles, 
determined to simplify and democratize tooling for organizational
management. To this end we built [`themis-contract`](github.com/informalsystems/themis-contract),
a tool for drafting, modifying, signing, and compiling legal contracts in
plaintext, using a mix of markdown templates and configuration files.
While we've recently deprioritized feature development here in order to focus 
more on our other projects, we've begun using the tool internally for our legal
documents. 

In particular, we have ported our Articles of Incorporation to
plaintext and host them on Gitlab. We have completed the process of passing
a shareholders resolution to ammend the articles. The entire process took
place in plaintext, on Gitlab. That is to say, we have completely eliminated
`.docx` and `.pdf` files from our workflow. Changes to the articles are viewed as
`git diff`s against the existing markdown and config files, and are signed using
git commits. The process is seemless, transparent, version controlled, and auditable.
Our company is now described primarily by a Dhall configuration file! 
It's a thing of beauty!

Try out the [Themis
tutorial](https://github.com/informalsystems/themis-contract#usage) to learn
more!

## Outlook

Informal Systems is now a year old, and like everyone else, we're relived to have 2020 behind us. 
Tons of exciting developments lay ahead, especially as Cosmos deploys the
Stargate upgrade and the Internet of Blockchains comes to life. We're working on
a ton of Cosmos related R&D, including a number of protocol design problems for
Tendermint and IBC, as well as continued development of the Cosmos Rust
ecosystem. And we'll continue improving Apalache and making formal verification
more accessible to engineers the world over.

To stay in-touch, and keep up with our mission of verifiable distributed systems and organizations,
subscribe to our [newsletter](https://informal.systems/index.html#newsletter) and follow us on 
[twitter](https://twitter.com/informalinc).
