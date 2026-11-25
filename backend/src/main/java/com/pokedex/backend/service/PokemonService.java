package com.pokedex.backend.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pokedex.backend.model.Pokemon;
import com.pokedex.backend.repository.PokemonRepository;

@Service 
public class PokemonService {
    
    @Autowired 
    private PokemonRepository repository;

    public List<Pokemon> listarTodos(){
        return repository.findAll();
    }

    public Pokemon buscarPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pokémon não encontrado com ID: " + id));
    }

    public Pokemon cadastrar(Pokemon pokemon) {
        return repository.save(pokemon);
    }

    public Pokemon atualizar(Integer id, Pokemon dadosAtualizados) {
        Pokemon existente = buscarPorId(id);
        existente.setName(dadosAtualizados.getName());
        existente.setHp(dadosAtualizados.getHp());
        existente.setAttack(dadosAtualizados.getAttack());
        existente.setDefense(dadosAtualizados.getDefense());
        existente.setSpecialAttack(dadosAtualizados.getSpecialAttack());
        existente.setSpecialDefense(dadosAtualizados.getSpecialDefense());
        existente.setSpeed(dadosAtualizados.getSpeed());
        existente.setTypes(dadosAtualizados.getTypes());
        return repository.save(existente);
    }

    public void remover(Integer id) {
        repository.deleteById(id);
    }

}
