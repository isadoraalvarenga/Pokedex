package com.pokedex.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.pokedex.backend.model.Pokemon;

public interface PokemonRepository extends MongoRepository<Pokemon, Integer> {
}