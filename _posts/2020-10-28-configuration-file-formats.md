---
layout: post
title: 'Configuration Files in Terms of User Empowerment'
author: Shon Feder
featuredImage: "/img/posts/config-files.png"
---

Informal Systems envisions _an open-source ecosystem of cooperatively owned and
governed distributed organizations running on reliable distributed systems_. Our
view on the technical and ethical dimensions of software configuration is part
of this vision. This post frames the problem of software configuration in terms
of user accessibility and empowerment and records our current thinking
regarding best practices for configuration file formats.

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->
**Table of Contents**

- [Configuration in context](#configuration-in-context)
    - [What is configuration and why does it matter for software?](#what-is-configuration-and-why-does-it-matter-for-software)
    - [In view of Informal System's vision](#in-view-of-informal-systems-vision)
    - [Configuration files](#configuration-files)
- [Three Regnant Approaches to Configuration File Formats](#three-regnant-approaches-to-configuration-file-formats)
    - [Configuration via ad-hoc key-value formats](#configuration-via-ad-hoc-key-value-formats)
    - [Configuration via Data-Serialization Formats](#configuration-via-data-serialization-formats)
    - [Configuration via a General Purpose Language](#configuration-via-a-general-purpose-language)
- [Recommended Approaches to Configuration](#recommended-approaches-to-configuration)
    - [Determine if you are configuring or serializing](#determine-if-you-are-configuring-or-serializing)
    - [When possible, go _configurationless_](#when-possible-go-_configurationless_)
    - [For all other human-focused configuration, use an appropriate DSL](#for-all-other-human-focused-configuration-use-an-appropriate-dsl)
        - [Dhall: The General Purpose Configuration DSL of Choice](#dhall-the-general-purpose-configuration-dsl-of-choice)
        - [Bespoke Domain Specific Configuration](#bespoke-domain-specific-configuration)
- [Conclusion](#conclusion)

<!-- markdown-toc end -->

# Configuration in context

> ... the configuration determines the possible behavior of the machine.
>
> <cite>Turing, ["On Computable Numbers"][turing-computable-numbers]</cite>

## What is configuration and why does it matter for software?

Let's root our thinking on configuration in the etymology of the word:

> **configure (.v)**
>
> late 14c. (implied in configured) "to form, dispose in a certain form," from
> Latin _configurare_ "to fashion after a pattern," from assimilated form of
> _com_ "with, together" (see _con-_) + _figurare_ "to form, shape," from
> _figura_ "a shape, form, figure" (from PIE root _\*dheigh-_ "to form, build").
>
> <cite>[etymonline](https://www.etymonline.com/word/configure#etymonline_v_18185)</cite>

Configuration is essentially concerned with shaping and forming the things in
the world that are receptive to our dictates.

The software we use is composed of programs that impress their patterns into the
[rhythms of our life][rhythm]. While open source software invites user-authors
to read and rewrite these programs at their source, configuration is an
interface that allows user-authors to change program behavior without needing to
rewrite and rebuild the programs. As such, it is the most accessible means for
people to alter the programmed patterns that form and transform their lives.
Questions around the user interface for program configuration pertain directly
to questions about the means and degrees of empowerment in the information age.

## In view of Informal System's vision

We can articulate four elements in focus for our vision:

1. **open source ecosystems**
2. **cooperative ownership and governance**
3. **distributed organizations**
4. **reliable distributed systems**

Considering software configuration in terms of interfaces for empowerment, we
can draw clear connections between these elements and the concerns of
configuration.

Our commitment to **open-source ecosystems** is rooted in our agreement with the
core emancipatory agenda of the [Free Software
Movement][free-software-movement], which seeks to protect and foster cooperation
by ensuring access to inspect, transform, and run the programs that coordinate
our interactions. Strictly speaking, configurability is orthogonal to
open-source development, since closed-source programs can be arbitrarily
configurable. But the extent to which we make our software susceptible to
intervention and redirection by the people who use it is intimately related to
the wider aims of _libre_ software.

We are [witnessing][witness-cybernetics] the most outsized ambitions of the
[cyberneticists][cybernetics] become actualized and [reshape our
world][how-algorithms-shape-our-world]. It is now clear that the control over
society and the development of civilization cannot be separated from control
over the programs that determine the courses of our movement, the networks of
our sociality, the flows of our capital, and the availability of our collective
knowledge. The struggle for **cooperative ownership and governance** cannot,
therefore, be separated from the struggle to configure the programs that shape
our reality.

As explained in the following, our preferred approach to configuration is via
plain text files. A principle motivator here is the ease with which plain text
configuration can become a shared interface for shaping **distributed
organizations**: simply checking in a config file to a git repo gives
distributed access and management for configuration of any shared programs that
read from the file.

Software configuration is just as relevant for distributed programs as it is for
any other piece of software. One of our main criteria in evaluating
configuration formats is how easy they make it to reason about and communicate
complex configurations. Reasonable configuration interfaces are even more
critical for **reliable distributed systems** than they are for monolithic,
centralized, synchronous programs, since the distributed nature of the systems
already guarantees a high threshold of complexity.

Choice of configuration file format is one small decision among the countless
decisions that go into designing and implementing software projects. But it is a
decision that sits at the intersection of Informal System's core concerns, and
the impact of the decision have far reaching implications.

## Configuration files

The following considerations are only concerned with formats of plain text
[configuration files][config-file]. There are interfaces for configuring
programs which are not based around editing text files and you've surely used
something similar to one of the following:

- [The Windows Registry][windows-registry]
- [The Debian Configuration system][debian-config-system]
- [macOS' Systems Preferences][macos-systems-preferences]

But we won't discuss those here.

Plain text configuration files have distinct benefits that make them especially
appealing to anyone concerned with programmability (which should probably be
everyone, given the ineluctable force of the [digital
revolution][digital-revolution]):

- There's no need to build an additional UI for configuration, since
  a user-author's text editor suffices.
- Configuration files are easy to duplicate, share, and place under version
  control.
- Configuration files are easy to read and analyze, so user-authors can use them
  in ways not initially anticipated.
- Configuration files are easy to write and generate, so user-authors can
  program the configuration of their programs.
- Programmable computers are fundamentally about reading and rewriting
  ("According to my  definition," Turing [wrote][turing-computable-numbers], "a
  number is computable if its decimal can be written down by a machine") and it
  is empowering and illuminating to cleave to foundations, when that will do.

# Three Regnant Approaches to Configuration File Formats

We see three approaches to file-based configuration predominating today. Each
has its advantages, but also significant downsides.

## Configuration via ad-hoc key-value formats

These formats are generally limited to very simple key-value pairs. Users of
Unix-like operating systems have likely encountered this species in a `.cnf`,
`.conf`, `.cfg` or `.ini` file.

These are generally easy for humans to read and write, but are not standardized,
and not a good choice for configurations of any complex or deeply nested
attributes. The lack of principled format and standardization also means they
are less susceptible to elegant or reliable generation. Since we take for
granted that user authors should be able to program the configurations of their
programs, this is a serious shortcoming.

[TOML][toml] is an interesting configuration format in this space, since it is
designed to provide the easy readability of key-value pair [INI
files][ini-files], but it can support nested structures -- up to a point. One
hits this point [sooner rather than later][toml-is-a-bad-format], however. It
can also be tricky to reason about the scoping rules of the format, and
challenging to generate non-trivial TOML configurations programmatically, and
one can find [plenty of other gripes besides][why-not-toml].

[toml]: https://github.com/toml-lang/toml
[ini-files]: https://en.wikipedia.org/wiki/INI_file
[why-not-toml]: https://hitchdev.com/strictyaml/why-not/toml/
[toml-is-a-bad-format]: https://github.com/avakar/pytoml/issues/15#issuecomment-217739462

## Configuration via Data-Serialization Formats

It has become common practice to use human-readable [data-serialization
formats][] (JSON, YAML, XML, S-Expressions) for application and infrastructure
configuration. While this has certain conveniences (e.g., there is a measure of
transparency), we believe that this approach is suboptimal for plain text
configuration management via configuration files.

In a plain text, open source environment, configuration files are the high-level
interfaces that user-authors touch when shaping their programs to suit their
needs. In contrast, data-serialization formats are -- and should be -- focused
on machine readability and optimized for data exchange between programs. There
is an impedance mismatch between the aims of data-serialization formats and the
needs of the humans who configure programs.

We see the symptoms of this mismatch all around us. The most obvious sign is the
[neoplastic][] growth of configuration schemes for non-trivial programs, driven
by the inadequacy of data-serialization formats for the task of user-author
configuration. E.g.,

- HCL's [string interpolation language][hcl-interpolation], born from JSON
- CircleCI's [YAML-based programming language][circle-ci-yaml]
- SaltStack's [YAML-based surface syntax for Python][saltstack-yaml]
- Judging by its [monstrous spec][yaml-spec] YAML is itself a symptom of this
  mismatch.
- [XML][xml] is widely reviled as a configuration format, because, while it is
  an excellent extensible markup language, it makes for a very noisy and verbose
  configuration syntax and, as a data exchange format, it has no advantages over
  s-expressions.

## Configuration via a General Purpose Language

A common alternative is to use a general purpose programming language for
configuration. E.g.,

- [Run commands files][] (like `.bashrc` or `.zshrc`)
- [Python's packaging][]
- Elixir's [Hex][hex] packaging system
- Scala's [SBT][sbt] build system

Since general purpose programming languages are designed to enable humans to
specify and communicate mechanizable programs, this approach doesn't suffer the
same problems as data-serialization formats. Instead, it suffers from a dual
problem: whereas data-serialization formats are too static and inexpressive,
general purpose programming language are too dynamic and expressive.

An application designer would generally like to specify the API of their
configuration system narrowly, to ensure predictable and well defined behavior.
As different applications interface to produce more complex systems, it becomes
increasingly important to ensure that users and application maintainers can
reason about the meanings and implications of the system's configuration. But if
any configuration step could potentially trigger arbitrary computations, we lose
the ability to reason locally. Moreover, reading and understanding configuration
files becomes just as fraught as reading and understanding application code,
except worse. Because the configuration code is **not** part of the source code,
we face the following complications:

- As a rule, config files do not live alongside the source.
- In the context in which config files are encountered, the user-author
  generally won't have access or visibility into the source.
- Config files are generally not validated by the same CI systems that protect
  the source.

These problems are discussed at length in [Caveat Configurator: How to replace
configs with code, and why you might not want to][caveat configurator].

# Recommended Approaches to Configuration

In light of the above considerations, we propose the following guidelines.

## Determine if you are configuring or serializing

Do you need a configuration system for your application, or is serialization
enough?

Serialization is

> the process of translating data structures or object state into a format that
> can be stored (for example, in a file or memory buffer) or transmitted (for
> example, across a network connection link) and reconstructed later (possibly
> in a different computer environment).
>
> <cite>[wikipedia][wiki-serialization]</cite>

Configuration via a configuration file does, of course, require that the
configured program be able to read the data written to the file, and so
serialization and deserialization are always involved in any configurations that
are persisted to disk. But this doesn't mean we should force user-author's to
configure our program in the same format we use to serialize the data! That's
asking a human to do machine work.

If you only need to write some data to disk to read back later (e.g. because
your program's principle interface for configuration is via a toggle GUI or
you're storing internal state), or you just need to pass data between programs,
then the standard serialization formats should suffice.

It is only when user-authors are expected to manually edit configuration files
as the primary interface to controlling application behavior that we advise the
following considerations:

## When possible, go _configurationless_

Does your system actually need a configuration language? Perhaps it's enough to
just call one module "config", set some constants there, and then rebuild and
redeploy when something needs to change.

We have used this approach for an internal tool that generates parameterized
worksheets. Our tool uses [mdx][mdx] to extract a documented data structure from
a code block in the project's `README.md`, which is then integrated into the
source code during compilation, configuring the program's behavior. This
approach ensures that the application configuration can be kept entirely within
the source code, while still presenting an accessible and easily understood
interface for user-authors.

This "configurationless" approach is ideal for many systems. Eschewing any
support for run-time configuration, these programs don't have to deal with the
complexity of any sort of configuration pulled in from outside of the source
code. So long as rebuilding and re-deploying the system is easy enough,
configuration changes are accomplished via changes directly to the source. A
major benefit of this approach is that user-authors are invited to write their
own changes into the source code from the very start.

Since there is no configuration living outside the source code, any changes to
the configuration will go through code review by application designers and
maintainers, be verified by CI, and kept alongside the core application logic.
This tight integration prevents the problems of configuration drift and the
unreasonably expressive configuration systems discussed above.

This approach is discussed in [Caveat Configurator: How to replace configs with
code, and why you might not want to][caveat configurator].

## For all other human-focused configuration, use an appropriate DSL

### Dhall: The General Purpose Configuration DSL of Choice

[Dhall](https://dhall-lang.org/) is a programmable configuration language,
providing algebraic data types, imports, and functions. Dhall is a language
specific to the domain of configuration _in general_. And we think it is a
suitable candidate for the _lingua franca_ of general configuration:

Benefits include:

- It is human readable and writable first, but it serializes to JSON, XML, and
  YAML for consumption by programs. So you can keep using the data serialization
  interfaces you are likely used to.
- The language is expressive enough to allow for modularity and configuration
  reuse.
- The language is [pure][] and [total][], guaranteeing predictable and well
  behaved evaluation: while the configurer can write arbitrarily complex
  programs to compute whatever configurations may be needed, those programs are
  guaranteed to terminate and not to complicate the environment with side
  effects.
- The language is statically typed, empowering application designers to
  precisely specify valid configurations and giving user-authors the assurance
  that their configuration is valid before they ever try to feed it to the
  application.
- Dhall is widely support, including by the following popular languages:
  - [Go](https://github.com/philandstuff/dhall-golang)
  - [Java](https://github.com/eta-lang/dhall-eta)
  - [Python](https://pypi.org/project/python-dhall/)
  - [Ruby](https://git.sr.ht/%7Esingpolyma/dhall-ruby)
  - [Rust](https://github.com/Nadrieril/dhall-rust)
  - [Scala](https://github.com/eta-lang/dhall-eta)
  - And, of course, [Haskell](https://github.com/dhall-lang/dhall-haskell)

For a list of companies using Dhall in production, see [Dhall in production][].

We are currently using Dhall internally and as the preferred configuration
language for [themis-contract][].

### Bespoke Domain Specific Configuration

If you anticipate your configuration needs becoming extensive and requiring many
novel or special-purpose constructs, then it may be worth the effort to write a
bespoke configuration DSL. This is risky -- since it can easily become a mess of
adhoc conventions -- and time consuming. But some projects have proven this can
be a successful approach.

Two successful software projects that have developed their own configurations
DSLs:

- The OCaml build system [Dune][dune] uses a configuration DSL written in
  s-expressions.
- The polyglot build system [Bazel][bazel] uses a configuration DSL that
  resembles Python.

# Conclusion

Configuration deserves careful consideration. There are good reasons to avoid
configuration entirely if the software is easy to deploy and the primary users
are the same as the primary authors. There are good reasons to use an
expressive, but principled, configuration language if your user-authors will
need to write any non-trivial configurations to adapt your programs to their
needs. There is no reason to force users to write or read complex JSON, YAML, or
XML configurations today (which is not to say that those formats don't have
their place in data serialization).

Careful choice of configuration interface can help make our programs more
responsive to the needs of user-authors, and can contribute to software designs
that empower rather than [entertain][entertain]. It is worth the energy to get
this right in own work, and, if possible, to push powerful institutions to
expose empowering and reasonable configuration mechanisms to their users.

More predictable, empowering, and accessible configuration formats are only a
tiny step in the right direction, but every step counts.

[bazel]: https://bazel.build/
[caveat configurator]: https://youtu.be/0pX7-AG52BU?t=480
[circle-ci-yaml]: https://circleci.com/docs/2.0/reusing-config/#section=configuration
[config-file]: https://en.wikipedia.org/wiki/Configuration_file
[configuration file]: https://en.wikipedia.org/wiki/Configuration_file
[cybernetics]: https://en.wikipedia.org/wiki/Cybernetics
[data-serialization formats]: https://en.wikipedia.org/wiki/Comparison_of_data-serialization_formats
[debian-config-system]: https://en.wikipedia.org/wiki/Debian_configuration_system
[dhall in production]: https://docs.dhall-lang.org/discussions/Dhall-in-production.html
[digital-revolution]: https://en.wikipedia.org/wiki/Digital_Revolution
[dune]: https://github.com/ocaml/dune
[entertain]: https://www.etymonline.com/search?q=entertain
[free-software-movement]: https://en.wikipedia.org/wiki/Free_software_movement
[hcl-interpolation]: https://www.terraform.io/docs/configuration-0-11/interpolation.html
[hex]: https://hex.pm/docs/usage
[how-algorithms-shape-our-world]: https://www.ted.com/talks/kevin_slavin_how_algorithms_shape_our_world
[macos-systems-preferences]: https://en.wikipedia.org/wiki/System_Preferences
[mdx]: https://github.com/realworldocaml/mdx
[neoplastic]: https://en.wikipedia.org/wiki/Neoplasm
[pure]: https://en.wikipedia.org/wiki/Pure_function
[python's packaging]: https://packaging.python.org/tutorials/packaging-projects/
[rhythm]: http://webapp1.dlib.indiana.edu/vwwp/view?docId=VAB7144&chunk.id=d1e542&brand=vwwp&doc.view=0&anchor.id=#VAB7144-003
[run commands files]: https://en.wikipedia.org/wiki/Run_commands
[saltstack-yaml]: https://docs.saltstack.com/en/latest/ref/configuration/examples.html#example-minion-configuration-file
[sbt]: https://www.scala-sbt.org/
[setup.py]: https://packaging.python.org/tutorials/packaging-projects/
[themis-contract]: https://github.com/informalsystems/themis-contract
[themis-render]: https://gitlab.com/informalsystems/shared/research-and-development/plaintext/themis-render#templates
[total]: https://en.wikipedia.org/wiki/Total_functional_programming
[turing-computable-numbers]: https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf
[user-authors]: ../terminology.md
[wiki-serialization]: https://en.wikipedia.org/wiki/Serialization
[windows-registry]: https://en.wikipedia.org/wiki/Windows_Registry
[witness-cybernetics]: https://theanarchistlibrary.org/library/the-invisible-committe-to-our-friends#toc16
[xml]: https://en.wikipedia.org/wiki/XML
[yaml-spec]: https://yaml.org/spec/1.2/spec.html
