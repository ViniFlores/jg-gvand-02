const typeDefs = `
type Movie {
  movieId: ID!
  title: String
  year: Int
  imdbRating: Float
  genres: [Genre] @relation(name: "IN_GENRE", direction: "OUT")
  ratedBy: [Rated]
  similar: [Movie] @cypher(
    statement: """MATCH (this)<-[:RATED]-(:User)-[:RATED]->(s:Movie) 
                  WITH s, COUNT(*) AS score 
                  RETURN s ORDER BY score DESC LIMIT {first}""")
}
type Genre {
  name: String
  movies: [Movie] @relation(name: "IN_GENRE", direction: "IN")
}
type User {
  userId: ID
  name: String
  rated: [Rated]
}

type Person {
  bio: String
  born: DateTime
  bornIn: String
  died: DateTime
  imdbId: String
  name: String
  poster: String
  tmdbId: String
  url: String
}

type Actor {
  bio: String
  born: DateTime
  bornIn: String
  died: DateTime
  imdbId: String
  name: String
  poster: String
  tmdbId: String
  url: String
}

type Director {
  bio: String
  born: DateTime
  bornIn: String
  died: DateTime
  imdbId: String
  name: String
  poster: String
  tmdbId: String
  url: String
}

type Rated @relation(name: "RATED") {
  from: User
  to: Movie
  rating: Float
  created: DateTime
}
`;

import { makeAugmentedSchema } from 'neo4j-graphql-js';

const schema = makeAugmentedSchema({ typeDefs });

import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  'bolt://34.207.120.57:32878',
  neo4j.auth.basic('neo4j', 'retailers-accomplishments-fashion')
);

import { ApolloServer } from 'apollo-server';

const server = new ApolloServer({ schema, context: { driver } });

server.listen(3004, '0.0.0.0').then(({ url }) => {
  console.log(`GraphQL API ready at ${url}`);
});

import { neo4jgraphql } from 'neo4j-graphql-js';

const resolvers = {
  Query: {
    Movie(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    }
  }
};