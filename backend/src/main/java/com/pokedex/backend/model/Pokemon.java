package com.pokedex.backend.model;

import java.util.List;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "pokemons")// Document pois o Mongo DB é orientado a documento (Json), ou seja, podemos gerar e guardar uma lista types, dentro do próprio pokemon
public class Pokemon {

    private Integer id;
    private String name;
    private Integer hp;
    private Integer attack;
    private Integer defense;
    private Integer SpecialAttack;
    private Integer SpecialDefense;
    private Integer speed;
    private List<String> types ;

    
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Integer getHp() {
        return hp;
    }
    public void setHp(Integer hp) {
        this.hp = hp;
    }
    public Integer getAttack() {
        return attack;
    }
    public void setAttack(Integer attack) {
        this.attack = attack;
    }
    public Integer getDefense() {
        return defense;
    }
    public void setDefense(Integer defense) {
        this.defense = defense;
    }
    public Integer getSpecialAttack() {
        return SpecialAttack;
    }
    public void setSpecialAttack(Integer specialAttack) {
        SpecialAttack = specialAttack;
    }
    public Integer getSpecialDefense() {
        return SpecialDefense;
    }
    public void setSpecialDefense(Integer specialDefense) {
        SpecialDefense = specialDefense;
    }
    public Integer getSpeed() {
        return speed;
    }
    public void setSpeed(Integer speed) {
        this.speed = speed;
    }
    public List<String> getTypes() {
        return types;
    }
    public void setTypes(List<String> types) {
        this.types = types;
    }
    
    

}
