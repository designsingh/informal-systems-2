---
layout: post
title: "Dev Update: Model-Based Testing"
author: Andrey Kuprianov & Ethan Buchman 
featuredImage: "/img/posts/apalache-update.png"
---

One of the critical issues when developing blockchain infrastructure is how to perform
testing of complicated scenarios, involving multiple distributed nodes, possibly connected to several heterogeneous blockchains. While traditional tests are good and necessary at the level of unit testing, it becomes prohibitively expensive for developers to create (and maintain!) multi-node, multi-blockchain tests. 

To address these needs, we are developing "Model Based Testing" (MBT) 
methodology and tools around the TLA+ specification language and the [Apalache model
checker](http://apalache.informal.systems/), allowing us to auto-generate
tests for real implementations (eg. in Go or Rust) from an underlying TLA+ model.

As an appetizer for our method, consider the [IBC token transfer test](https://github.com/cosmos/cosmos-sdk/blob/v0.41.0/x/ibc/applications/transfer/handler_test.go), which spans more than 100 lines of code to setup the 3 blockchains and perform simple token transfers between them. In contrast to this manual test, a model-based test is the following 5 lines of TLA+:

```tla+
TestUnescrowTokens ==
  \E s \in DOMAIN history :
     /\ IsSource(history[s].packet)
     /\ history[s].handler = "OnRecvPacket"
     /\ history[s].error = FALSE
```

While not obvious from the first glance, these 5 lines generate the complex setup with 3 blockchains and token transfers between them, which is roughly equivalent to the manual test referred above. In fact, this simple TLA+ test allowed us to catch a [real bug in the token transfer IBC application](https://github.com/cosmos/cosmos-sdk/issues/8120). For details on this particular case see our recent [talk at Interchain
  Conversations 2020](https://youtu.be/zLBl3ouWTWw); for the details on general MBT methodology please watch the [talk at TLA+ Community Event 2020](https://www.youtube.com/watch?v=aveoIMphzW8).

Model based testing matured significantly in the last six months: it is now
part of the Tendermint light client test suites (part of CI), both in
[Rust](https://github.com/informalsystems/tendermint-rs/tree/v0.17.1/light-client/tests/support/model_based)
and [Go](https://github.com/tendermint/tendermint/tree/v0.34.3/light/mbt)
implementations. Light client model-based tests are derived from the [TLA+ model
of the Tendermint Light Client](https://github.com/tendermint/spec/tree/b270ab8d15410ab4e70e3835ef2bbd3bbf9c48d7/spec/light-client).
The tests themselves are simple TLA+ assertions that
describe the desired shape of the Light Client execution - see
[LightTests.tla](https://github.com/informalsystems/tendermint-rs/blob/v0.17.1/light-client/tests/support/model_based/LightTests.tla)
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
[token transfer IBC application in Go](https://github.com/cosmos/cosmos-sdk/issues/8120), which we touched upon above.
In coming months, we plan to further improve developer experience of MBT so
that development and maintenance of MBT tests can be under responsibility of
the corresponding development teams. There is a clear interest from core Cosmos
development teams to further expand their test suites using MBT.

On the methodology and tooling side, our MBT plans for Q1/Q2 2021 include:
- generation and execution of massive test suites with thousands of tests, 
  without the need to micro-manage individual tests;
- versioning and complete reproducibility of model-based tests in all environments;
- automation of many manual steps, including auto-generation of fragments of 
  TLA+ models or target-language test drivers (limited to Rust and Go in the first iteration);
- support developers with AI-based hints when building model-based test suites.


If you're interested in Model Based Testing for your own system, [get in
touch!](mailto:hello@informal.systems)! 
