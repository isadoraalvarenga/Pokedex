import { useState, useEffect } from "react";
import { trainers, pokemonTypes } from "./utils/data";
import {
  listarPokemons,
  criarPokemon,
  atualizarPokemon,
  removerPokemon,
} from "./services/pokemonApi";
import SearchBar from "./components/SearchBar";
import TypeFilter from "./components/TypeFilter";
import PokemonList from "./components/PokemonList";
import PokemonDetails from "./components/PokemonDetails";
import TrainersPanel from "./components/TrainersPanel";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";

function adaptarParaFront(p) {
  const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`;
  const spAtk = p.specialAttack ?? p.spAttack ?? p.special_attack ?? 0;
  const spDef = p.specialDefense ?? p.spDefense ?? p.special_defense ?? 0;

  return {
    ...p,
    sprite,
    image: sprite,
    specialAttack: spAtk,
    specialDefense: spDef,
    types: (p.types || []).map((t) =>
      typeof t === "string" ? { name: t } : t
    ),
    stats: {
      hp: p.hp ?? 0,
      attack: p.attack ?? 0,
      defense: p.defense ?? 0,
      specialAttack: spAtk,
      specialDefense: spDef,
      "special-attack": spAtk,
      "special-defense": spDef,
      spAttack: spAtk,
      spDefense: spDef,
      speed: p.speed ?? 0,
    },
  };
}

const FORM_INICIAL = {
  id: "",
  name: "",
  hp: 50,
  attack: 50,
  defense: 50,
  specialAttack: 50,
  specialDefense: 50,
  speed: 50,
  typesText: "Normal",
};

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroApi, setErroApi] = useState("");

  const [view, setView] = useState("pokedex");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(FORM_INICIAL);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites")) ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setErroApi("");
      const dados = await listarPokemons();
      setPokemons(dados.map(adaptarParaFront));
    } catch (err) {
      setErroApi("Não foi possível conectar ao back-end (http://localhost:8080).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleNovo = () => {
    const proximoId =
      pokemons.length > 0 ? Math.max(...pokemons.map((p) => p.id)) + 1 : 151;
    setEditingId(null);
    setFormData({ ...FORM_INICIAL, id: proximoId });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditar = (pokemon) => {
    setEditingId(pokemon.id);
    setFormData({
      id: pokemon.id,
      name: pokemon.name,
      hp: pokemon.stats?.hp ?? pokemon.hp ?? 50,
      attack: pokemon.stats?.attack ?? pokemon.attack ?? 50,
      defense: pokemon.stats?.defense ?? pokemon.defense ?? 50,
      specialAttack: pokemon.stats?.specialAttack ?? pokemon.specialAttack ?? 50,
      specialDefense: pokemon.stats?.specialDefense ?? pokemon.specialDefense ?? 50,
      speed: pokemon.stats?.speed ?? pokemon.speed ?? 50,
      typesText: (pokemon.types || []).map((t) => t.name || t).join(", "),
    });
    setSelected(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();

    const idNum = Math.max(1, Number(formData.id));
    const hpNum = Math.max(0, Number(formData.hp));
    const atkNum = Math.max(0, Number(formData.attack));
    const defNum = Math.max(0, Number(formData.defense));
    const spAtkNum = Math.max(0, Number(formData.specialAttack));
    const spDefNum = Math.max(0, Number(formData.specialDefense));
    const spdNum = Math.max(0, Number(formData.speed));

    const payload = {
      id: editingId !== null ? Number(editingId) : idNum,
      name: formData.name.trim(),
      hp: hpNum,
      attack: atkNum,
      defense: defNum,
      specialAttack: spAtkNum,
      specialDefense: spDefNum,
      spAttack: spAtkNum,
      spDefense: spDefNum,
      special_attack: spAtkNum,
      special_defense: spDefNum,
      speed: spdNum,
      types: formData.typesText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editingId !== null) {
        await atualizarPokemon(editingId, payload);
      } else {
        await criarPokemon(payload);
      }
      setShowForm(false);
      setEditingId(null);
      await carregarDados();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemover = async (id) => {
    if (!window.confirm(`Deseja realmente excluir o Pokémon #${id}?`)) return;
    try {
      await removerPokemon(id);
      setSelected(null);
      await carregarDados();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = pokemons.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).includes(search);
    const matchesType =
      !selectedType || p.types.some((t) => t.name === selectedType);
    const matchesFavorite = !onlyFavorites || favorites.includes(p.id);
    return matchesSearch && matchesType && matchesFavorite;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "id") return a.id - b.id;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return (b.stats[sortBy] ?? 0) - (a.stats[sortBy] ?? 0);
  });

  const handleRandom = () => {
    if (pokemons.length === 0) return;
    setSelected(pokemons[Math.floor(Math.random() * pokemons.length)]);
  };

  return (
    <div className="app">
      <Header view={view} onChangeView={setView} />

      {view === "pokedex" ? (
        <>
          <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
            <button
              onClick={handleNovo}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                background: "#e3350d",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              + Cadastrar Novo Pokémon
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSalvar}
              style={{
                maxWidth: "520px",
                margin: "0 auto 20px",
                padding: "16px",
                borderRadius: "12px",
                background: "#1e293b",
                color: "#fff",
                display: "grid",
                gap: "10px",
              }}
            >
              <h3 style={{ margin: 0 }}>
                {editingId !== null ? `Editar Pokémon #${editingId}` : "Cadastrar Pokémon"}
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "8px" }}>
                <label>
                  ID:
                  <input
                    type="number"
                    min="1"
                    required
                    disabled={editingId !== null}
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    style={{ width: "100%", padding: "6px" }}
                  />
                </label>
                <label>
                  Nome:
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%", padding: "6px" }}
                  />
                </label>
              </div>

              <label>
                Tipos (separados por vírgula, ex: Fire, Flying):
                <input
                  type="text"
                  required
                  value={formData.typesText}
                  onChange={(e) => setFormData({ ...formData, typesText: e.target.value })}
                  style={{ width: "100%", padding: "6px" }}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {[
                  ["hp", "HP"],
                  ["attack", "Attack"],
                  ["defense", "Defense"],
                  ["specialAttack", "Sp. Atk"],
                  ["specialDefense", "Sp. Def"],
                  ["speed", "Speed"],
                ].map(([campo, label]) => (
                  <label key={campo}>
                    {label}:
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData[campo]}
                      onChange={(e) =>
                        setFormData({ ...formData, [campo]: e.target.value })
                      }
                      style={{ width: "100%", padding: "6px" }}
                    />
                  </label>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ padding: "8px 14px", cursor: "pointer" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Salvar
                </button>
              </div>
            </form>
          )}

          <SearchBar value={search} onChange={setSearch} />
          <TypeFilter
            types={pokemonTypes}
            selected={selectedType}
            onChange={setSelectedType}
          />
          <Toolbar
            sortBy={sortBy}
            onSortChange={setSortBy}
            onRandom={handleRandom}
            onlyFavorites={onlyFavorites}
            onToggleOnlyFavorites={() => setOnlyFavorites((v) => !v)}
          />

          {loading ? (
            <p style={{ textAlign: "center" }}>Carregando Pokémon do MongoDB...</p>
          ) : erroApi ? (
            <p style={{ textAlign: "center", color: "red" }}>{erroApi}</p>
          ) : (
            <PokemonList
              pokemons={sorted}
              onSelect={setSelected}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </>
      ) : (
        <TrainersPanel trainers={trainers} onSelectPokemon={setSelected} />
      )}

      {selected && (
        <div>
          <PokemonDetails pokemon={selected} onClose={() => setSelected(null)} />
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2000,
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              onClick={() => handleEditar(selected)}
              style={{
                padding: "10px 18px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Editar Pokémon
            </button>
            <button
              onClick={() => handleRemover(selected.id)}
              style={{
                padding: "10px 18px",
                background: "#dc2626",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Excluir Pokémon
            </button>
          </div>
        </div>
      )}
    </div>
  );
}