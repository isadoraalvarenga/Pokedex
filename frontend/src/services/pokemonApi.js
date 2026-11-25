const API_URL = "http://localhost:8080/api/pokemons";

export async function listarPokemons() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Erro ao buscar Pokémon da API");
  return res.json();
}

export async function criarPokemon(pokemon) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pokemon),
  });
  if (!res.ok) throw new Error("Erro ao cadastrar Pokémon");
  return res.json();
}

export async function atualizarPokemon(id, pokemon) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pokemon),
  });
  if (!res.ok) throw new Error("Erro ao atualizar Pokémon");
  return res.json();
}

export async function removerPokemon(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao remover Pokémon");
}