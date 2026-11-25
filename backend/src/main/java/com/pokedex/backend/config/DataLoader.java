package com.pokedex.backend.config;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import com.pokedex.backend.model.Pokemon;
import com.pokedex.backend.repository.PokemonRepository;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private PokemonRepository repository;

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() > 0) {
            System.out.println("Coleção pokemons já populada (" + repository.count() + " registros).");
            return;
        }

        String sql = new String(
            new ClassPathResource("Script_Pokedex.sql").getInputStream().readAllBytes(),
            StandardCharsets.UTF_8
        );

        Map<Integer, String> typeMap = new HashMap<>();
        String typesBlock = extractInsertBlock(sql, "Types");
        Matcher mType = Pattern.compile("\\((\\d+),\\s*'([^']+)'\\)").matcher(typesBlock);
        while (mType.find()) {
            typeMap.put(Integer.parseInt(mType.group(1)), mType.group(2));
        }

        Map<Integer, List<String>> pokemonTypes = new HashMap<>();
        String ptBlock = extractInsertBlock(sql, "Rel_Pokemon_Type");
        Matcher mPt = Pattern.compile("\\((\\d+),\\s*(\\d+)\\)").matcher(ptBlock);
        while (mPt.find()) {
            int pokeId = Integer.parseInt(mPt.group(1));
            int typeId = Integer.parseInt(mPt.group(2));
            String typeName = typeMap.get(typeId);
            if (typeName != null) {
                pokemonTypes.computeIfAbsent(pokeId, k -> new ArrayList<>()).add(typeName);
            }
        }

        List<Pokemon> pokemons = new ArrayList<>();
        String pokeBlock = extractInsertBlock(sql, "Pokemon");
        Matcher mPoke = Pattern.compile(
            "\\((\\d+),\\s*'([^']+)',\\s*(\\d+),\\s*(\\d+),\\s*(\\d+),\\s*(\\d+),\\s*(\\d+),\\s*(\\d+)\\)"
        ).matcher(pokeBlock);

        while (mPoke.find()) {
            Pokemon p = new Pokemon();
            int id = Integer.parseInt(mPoke.group(1));
            p.setId(id);
            p.setName(mPoke.group(2));
            p.setHp(Integer.parseInt(mPoke.group(3)));
            p.setAttack(Integer.parseInt(mPoke.group(4)));
            p.setDefense(Integer.parseInt(mPoke.group(5)));
            p.setSpecialAttack(Integer.parseInt(mPoke.group(6)));
            p.setSpecialDefense(Integer.parseInt(mPoke.group(7)));
            p.setSpeed(Integer.parseInt(mPoke.group(8)));
            p.setTypes(pokemonTypes.getOrDefault(id, List.of()));
            pokemons.add(p);
        }

        repository.saveAll(pokemons);
        System.out.println("Sucesso! " + pokemons.size() + " Pokémon salvos no MongoDB Atlas!");
    }

    private String extractInsertBlock(String sql, String tableName) {
        Matcher m = Pattern.compile(
            "INSERT\\s+INTO\\s+`?" + tableName + "`?\\b[\\s\\S]*?;",
            Pattern.CASE_INSENSITIVE
        ).matcher(sql);
        StringBuilder sb = new StringBuilder();
        while (m.find()) sb.append(m.group());
        return sb.toString();
    }
}