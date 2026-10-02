import supabase from "../config/supabase.js";

function telefoneValido(valor) {
  if (typeof valor !== "string") return false;
  return /^[1-9]{2}\d{8,9}$/.test(valor.replace(/\D/g, ""));
}

// GET /atendimentos
export async function listar(req, res) {
  const { data, error } = await supabase
    .from("atendimentos")
    .select(
      `
      *,
      responsaveis ( id, nome, tipo )
    `,
    )
    .order("data", { ascending: true })
    .order("horario", { ascending: true });

  if (error) return res.status(500).json({ erro: error.message });
  res.json(data);
}

// GET /atendimentos/:id
export async function buscarPorId(req, res) {
  const { data, error } = await supabase
    .from("atendimentos")
    .select(`*, responsaveis ( id, nome, tipo )`)
    .eq("id", req.params.id)
    .single();

  if (error)
    return res.status(404).json({ erro: "Atendimento não encontrado" });
  res.json(data);
}

// POST /atendimentos
export async function criar(req, res) {
  const {
    nome_cliente,
    telefone,
    endereco_visita,
    data,
    horario,
    responsavel_id,
    observacoes,
    status,
  } = req.body;

  if (
    !nome_cliente ||
    !telefone ||
    !endereco_visita ||
    !data ||
    !horario ||
    !responsavel_id
  ) {
    return res
      .status(400)
      .json({ erro: "Preencha todos os campos obrigatórios." });
  }

  if (!telefoneValido(telefone)) {
    return res.status(400).json({
      erro: "Informe um telefone com DDD e 10 ou 11 dígitos.",
    });
  }

  const dataInformada =
    typeof data === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data)
      ? new Date(`${data}T00:00:00.000Z`)
      : null;

  if (
    !dataInformada ||
    !Number.isFinite(dataInformada.getTime()) ||
    dataInformada.toISOString().slice(0, 10) !== data
  ) {
    return res.status(400).json({ erro: "Informe uma data válida." });
  }

  const hoje = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Fortaleza",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  if (data < hoje) {
    return res.status(400).json({
      erro: "Não é possível agendar para uma data anterior a hoje.",
    });
  }

  const { data: novo, error } = await supabase
    .from("atendimentos")
    .insert([
      {
        nome_cliente,
        telefone,
        endereco_visita,
        data,
        horario,
        responsavel_id,
        observacoes,
        status,
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json(novo);
}

// PUT /atendimentos/:id
export async function atualizar(req, res) {
  const {
    nome_cliente,
    telefone,
    endereco_visita,
    data,
    horario,
    responsavel_id,
    observacoes,
    status,
  } = req.body;

  if (!telefoneValido(telefone)) {
    return res.status(400).json({
      erro: "Informe um telefone com DDD e 10 ou 11 dígitos.",
    });
  }

  if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return res
      .status(400)
      .json({ erro: "O ano da data deve ter quatro dígitos." });
  }

  const { data: atualizado, error } = await supabase
    .from("atendimentos")
    .update({
      nome_cliente,
      telefone,
      endereco_visita,
      data,
      horario,
      responsavel_id,
      observacoes,
      status,
    })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ erro: error.message });
  res.json(atualizado);
}

// DELETE /atendimentos/:id
export async function remover(req, res) {
  const { error } = await supabase
    .from("atendimentos")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ erro: error.message });
  res.status(204).send();
}

// GET /atendimentos/dashboard
export async function dashboard(req, res) {
  const { data, error } = await supabase
    .from("dashboard_indicadores")
    .select("*")
    .single();

  if (error) return res.status(500).json({ erro: error.message });
  res.json(data);
}
