# Project Vision

Build two educational, portfolio-ready software products that can stand on their own and later integrate into a richer final experience.

The first product is **Historical Bar**, a stylized conversational web application where a user can create and interact with a historical character in a game-like bar environment.

The second product is a **standalone RAG Service**, implemented as a reusable Python API for ingesting source material and retrieving grounded knowledge with citations.

The final system combines both products so Historical Bar can enrich character conversations with source-grounded knowledge retrieved from the RAG Service.

## Product A — Historical Bar

Historical Bar should be valuable before RAG exists.

A user can create a historical character by providing:

- Character name.
- Additional role/personality instructions.
- A portrait image prepared for a deterministic puppet-style mouth animation.
- Eventually, bibliography/source files that will be forwarded to the RAG system after integration.

The main experience places the character opposite the user in a quiet, game-like bar scene. Conversation happens through text chat. Character responses are rendered as text and spoken aloud through browser-based speech synthesis while the puppet mouth animates. Additional idle animations may make the scene feel more alive.

The first complete version uses an LLM directly, without RAG. The LLM is responsible for acting as the selected historical character based on its prompt, model knowledge, and conversation history.

This makes Historical Bar a complete portfolio project by itself rather than merely a wrapper waiting for the RAG subsystem.

## Product B — RAG Service

The RAG Service is intentionally developed as an independent educational project.

Its purpose is to learn and implement Retrieval-Augmented Generation deeply rather than hide it inside the application backend.

The service should remain product-agnostic and operate on reusable concepts such as:

- Collections.
- Documents.
- Chunks.
- Queries.
- Retrieval results.
- Sources and citations.

Its scope will eventually include:

- Document ingestion and parsing.
- Chunking and metadata.
- Embeddings and indexing.
- Vector retrieval.
- Reranking and retrieval improvements.
- Citation metadata.
- Evaluation and benchmarking.
- GraphRAG experimentation after establishing a simpler baseline.

The RAG Service should be independently testable and potentially reusable by future applications unrelated to Historical Bar.

## Final integration

Once both products are functional independently, Historical Bar will consume the RAG Service through its HTTP API.

Historical Bar remains responsible for the conversation, character behavior, prompt orchestration, and final LLM response.

The RAG Service remains responsible for finding relevant evidence and returning grounded context plus source metadata.

Conceptually:

```text
Historical Bar
    │
    │ user question
    ▼
Application Backend
    │
    ├── conversation + character context
    │
    └── query ─────► RAG Service
                         │
                         ▼
                   relevant evidence
                   + source metadata
                         │
    ◄────────────────────┘
    │
    ▼
Conversational LLM
    │
    ▼
character response + citations
```

## Learning priorities

The project intentionally separates implementation effort from learning effort:

- Frontend implementation may be delegated heavily to coding agents once it is well specified.
- Historical Bar backend and LLM integration should remain understandable and intentionally designed.
- The RAG Service is a primary hands-on learning area and may be implemented with limited or no agentic programming if that better supports learning.
- The project owner should remain deeply involved in RAG architecture, retrieval, embeddings, evaluation, data storage, citations, API design, and deployment.

## Delivery philosophy

The system should evolve incrementally without requiring both products to exist at the same time.

1. Build Historical Bar as a complete LLM-powered application.
2. Develop the RAG Service separately as its own reusable Python system.
3. Integrate both products through a stable API contract.

This structure deliberately favors learning clarity, reusable boundaries, and portfolio value over minimizing the number of repositories or deployments.
