package com.pokedex.backend.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.pokedex.backend.model.Pokemon;
import com.pokedex.backend.service.PokemonService;

@RestController
@RequestMapping("/api/pokemons")
@CrossOrigin("*")
public class PokemonController {

    @Autowired
    private PokemonService service;

    @GetMapping
    public List<Pokemon> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Pokemon buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Pokemon cadastrar(@RequestBody Pokemon pokemon) {
        return service.cadastrar(pokemon);
    }

    @PutMapping("/{id}")
    public Pokemon atualizar(@PathVariable Integer id, @RequestBody Pokemon pokemon) {
        return service.atualizar(id, pokemon);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable Integer id) {
        service.remover(id);
    }
}