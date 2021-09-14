---
layout: post
title: "Themis Update"
author: Shon Feder
featuredImage: "/img/posts/articles-of-incorporation-params.png"
---

Informal is [a new kind of company][informal-organizations]: we are built on
co-operative principles and we are determined to simplify and democratize
tooling for organizational management. To this end we built
[`themis-contract`][themis-contract], a tool for drafting, modifying, signing,
and compiling legal contracts in plaintext, using a mix of markdown templates
and configuration files. While we've recently deprioritized feature development
in order to intensify the focus on our [other projects][], we have been using
the tool internally for our legal documents. This post details some of the
highlights of our current process and explains a bit of the motivation behind
our efforts in this direction.

**Table of Contents**

- [Our corporate structure: released in versions (semantically)](#our-corporate-structure-released-in-versions-semantically)
- [Our corporate charter: stored in DVC (git)](#our-corporate-charter-stored-in-dvc-git)
- [Our amendment processes: modeled after MVC (via GitLab)](#our-amendment-processes-modeled-after-mvc-via-gitlab)
- [Learn more](#conclusion)

At the end of 2020, we completed porting our Articles of Incorporation to
plaintext and hosted them on Gitlab. We also designed, implemented, and utilized
a process for proposing, reviewing, and passing shareholder resolutions to amend
the articles via merge requests. The entire process takes place through version
controlled plaintext, with some help from  Gitlab (though any other [software
forge][] would work just as well). In other words, we have completely eliminated
`.docx` files from our workflow, and `.pdf`s only appear at the end of the
process, when we want a polished, human readable view (e.g. for legal
purposes).  Changes to the articles are reviewed as `git diff`s against the
existing markdown and config files, and legal documents receive legally binding
signatures applied as commits. The process is not quite seamless, but we can see
how the seams can be ironed out. Most importantly, it is transparent, version
controlled, easy to automate and extend, and fully auditable.

[informal-organizations]: https://informal.systems/2020/09/21/informal-owners/

## Our corporate structure: released in versions (semantically)

Part of our long term vision is working towards a computable corporation[^1].
Our current efforts in this direction include learning how to manage the
development of our corporation like we manage the development of our software.
We version our software, so we are versioning our corporate structure. We use 
semantic versioning in our software, so we are using semantic versioning for our
corporate structure.

Our corporate structure is currently at `v3.0.0`. What does this mean? Semantic 
versioning follows the schema `v{major}.{minor}.{patch}`. We are currently 
interpreting these as follows:

- We increment the `major` version when new changes to the corporate structure
  or its essential properties are made, such that changes are required to our 
  governance. For instance, if we alter the number of shares issued, or the 
  rights granted to shareholders.
- We increment the `minor` version when new changes are issued that enable 
  changes to operations or assets, but don't require changes to governance. For 
  instance, a change to the address where the corporation is registered.
- We increment `patch` version when we make inconsequential changes to the
  documents, or when the infrastructure that supports our process changes.

## Our corporate charter: stored in DVC (git)

"Articles of Incorporation" are 

> a document or charter that establishes the existence of a corporation 
>
> ... 
>
> The articles of incorporation outline the governance of a corporation along
> with the corporate bylaws and the corporate statutes in the state [or
> province] where articles of incorporation are filed. To amend a corporate
> charter, the amendment must usually be approved by the company's board of
> directors and voted on by the company's shareholders"
>
> — [wikipedia][articles of incorporation].

Usually such amendments take the form of additional documents that layer new
clauses and qualifications on top of the old. To understand the actual
properties of the corporation after several amendments, you have to read through
the entire history, and reason out how the subsequent amendments interact with,
negate, or supersede the previous text. In contrast, our amendments are made as
changesets on top of the current charter. The historical record of the changes
is available in the git log, with the past filed amendments demarcated by our 
tagged releases. But to understand the current corporate state, you need only 
the documents on the `HEAD` of our `main` branch.

## Our amendment processes: modeled after MVC (via GitLab)

We still need PDFs, cause law firms and governments won't just pull our repo  to
verify that the corporate's state compiles (yet!), but in the approach we have
implemented, those documents are only a _view_ of the essential properties of
the corporation. Those properties include things like the corporation's name,
its governance structure, the shares it can distribute, and its bylaws.

Our workflow for tracking and evolving the essential properties of the
corporation follows an approach modelled after to the Model-View-Controller
([MVC][]) design pattern.

Here's an overview:

### Model

We model the corporation by encoding its essential properties as human and
machine readable data. 

- The data in the previous commits in the history of the trunk reflect _past,
  actual states_.
- The data in the files at the HEAD of the trunk reflect the _current,
  actual state_.
- The data in files in branches off of the trunk reflect _alternate,
  possible states_.

The model is represented by data in plain text files. We use two formats:

- _Dhall_: For precisely structured, machine-readable data (taking advantage of
  the [Curry-Howard correspondence][curry-howard] to encode logical properties).
- _markdown_: For loosely structured, human-readable text (this may include
  templates that embed data from the [Dhall][dhall] files into the text).

We've [written at length][config-post] on our rational for chosing configuration
languages with nice properties like Dhall, but now we'll take moment to detail
what it looks like to leverage a configuration language with [System F][system
f] at its core.  Here's an excerpt from the Dhall file that collects the
essential properties of our corporate structure:

```haskell
let ShareClass
    : Type
    = < Uncommon | Deference | Informal >

let ShareClassLimits
    : Type
    = Map.Type ShareClass (Optional Natural)

let ShareHolders
    : Type
    = Map.Type ShareClass (List ThemisContract.Signatory)

let Shares
    : Type
    = { classes : ShareClassLimits
      , holders : ShareHolders
      , transferRestrictionsSchedule : Text
      }
```

- The `ShareClass` type distinguishes three alternative classes of shares:
  "Uncommon Shares",  "Deference Shares", and "Informal Shares".
- The `ShareClassLimits` type lets us represent the limit on the amount of each
  class of shares that can be issued. This is a map between `ShareClass` and
  values of type  `Optional Natural`. This means each share class can either  be
  limited to `Some n`, where the number of allowed shares is `n >= 0`, or
  `None`, indicating that the share class is unlimited.
- The `ShareHolders` type maps each `ShareClass` to a list of signatories. 
- Finally, the `Shares` type is a structure that conjoins all the essential
  facts about our shares. The `Shares` type is read as a proposition claiming
  that there is a fixed set of `classes` of shares with the associated
  `ShareClassLimits`, that these share classes are held by some `ShareHolders`,
  and that the shares are further restricted by the arbitrary `Text` of the
  `transferRestrictionsSchedule`.

To prove that this proposition holds, we must construct a value of type
`Shares`. That looks like this:

```haskell
let shares
    : Shares
    =
      { classes =
        [ shareClassLimit ShareClass.Uncommon (None Natural)
        , shareClassLimit ShareClass.Deference (None Natural)
        , shareClassLimit ShareClass.Informal (None Natural)
        ]
      , holders =
        [ shareClassHolders ShareClass.Uncommon uncommonShareholders
        , shareClassHolders ShareClass.Deference deferenceShareholders
        , shareClassHolders ShareClass.Informal informalShareholders
        ]
      , transferRestrictionsSchedule =
          ./schedule.md sha256:ca5425eb78ff5eef69b7c2fbfd5b05f2a00c058c1496ab9afd4313cf5ab15981 as Text
      }
```

Note that while the `transferRestrictionsSchedule` is an unstructured blob of
text, it is protected with a cryptographic hash. When the signatories sign the
resolution to add an amendment, `themis-contract` verifies that the hash matches
the content of the `./schedule.md` file. This allows us to encode a different
form of proof of the content, which allows us to guarantee the content is what
signatories think it is, even when we don't have time to analyze the structure
down to its logical atoms.

### View

We render views of the _model_ as human-readable documents (which can be filed
with the government, distributed to shareholders, reviewed by lawyers, etc.).
Views are generally PDFs generated by `themis-contract`, but they could be any
other form of document (DOCX, DHTML, etc.).

The mapping from the data
in the configuration files into the rendered output format is configured via
mustache templates.  Here's a segment of the view into our initial articles,
before we had established different share classes:

```markdown
{% raw %}
# The classes and any maximum number of shares that the corporation is authorized to issue / Catégories et le nombre maximal d’actions que la société est autorisée à émettre
{{#shares}}
The corporation is authorized to issue 
{{#amountLimit}}{{.}}{{/amountLimit}}
{{^amountLimit}}an unlimited number of{{/amountLimit}}
{{class}} shares
{{/shares}}
{% endraw %}
```

If there is an `amountLimit` (i.e., if is not `None`), we present the limit on
the number of shares of that class allowed, otherwise, we report that an
unlimited number of shares can be issued.

The view into the rest of our charter is configured similarly. Since we are
using [Pandoc][pandoc] under the hood, we could easily target many other
formats, and, since the data is all machine readible, it is easy to process it
for other purposes to provide more interactive views or reports, should the need
ever arise.

### Controller

We transform the _model_ to reflect (and _effect_) changes to the corporation's
essential properties using "commands" that pass through our "controller".
Currently, commands are initiated by making changes to the model (the
configuration and markdown text) in a branch. The commands are then proposed for
action by opening a merge request. Finally, the commands are executed once all
shareholders have marked their approval by singing the documents (again, tracked
in git).

Here is our current process for making changes via this "controller":

1. We create a new feature branch. Changes on this branch propose an alternative
   set of properties for the corporation to adopt.
2. We change the relevant properties of the corporation by altering the
   params files (this will include alterations to the `schedule.md` -- and any
   other markdown file included in the params -- which count as alteration of
   the main param file, because it is all literally embedded into the `params`
   configuration and protected by cryptographic hashes).
3. We run `themis-contract update` to update the configs to track the new 
   changes.
4. We run `themis-contract compile` to generate an updated view in the
   `contract.pdf`.
5. Each shareholder signs and commits their signatures to the feature branch
   using `themis-contract`. Signing the contract is tantamount to approving the
   PR, and each signing commit includes a hash of the contract at the time it is
   signed.
6. When the contract is fully executed, we merge the branch into the trunk. This
   reflects the fact that the changes have now been ratified and are in effect.
7. CI/CD will then release a new version of the signed contract, so that the
   artifact is available in the "library" of releases.

## Learn more

Check out the [Themis tutorial][] to try out the tooling for yourself or
[contact][contact-us] to collaborate or to learn more.

[themis-contract]: https://github.com/informalsystems/themis-contract
[themis tutorial]: https://github.com/informalsystems/themis-contract#usage
[other projects]: https://informal.systems/products/
[software forge]: https://en.wikipedia.org/wiki/Forge_(software)
[digital revolution]: https://en.wikipedia.org/wiki/Digital_Revolution.
[articles of incorporation]: https://en.wikipedia.org/wiki/Articles_of_incorporation
[mvc]: https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller
[curry-howard]: https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence
[config-post]:  https://informal.systems/2020/10/28/configuration-file-formats/
[system f]: https://en.wikipedia.org/wiki/System_F
[dhall]: https://dhall-lang.org/
[pandoc]: https://pandoc.org/

[^1]: This is, of course, just one vector in the ongoing [digital revolution].

[contact-us]: https://github.com/informalsystems/themis-contract#%EF%B8%8F-get-involved
