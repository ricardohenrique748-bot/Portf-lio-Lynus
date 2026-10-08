/* ============================================================
   LYNUS TECH — Supabase (projeto compartilhado com o APP-FITNESS)
   O site só grava na tabela site_leads (ver supabase/site_leads.sql).
   Chave pública: pode ficar no site, o banco só deixa inserir.
   ============================================================ */
(function () {
  var URL = "https://pqfimyokbvqlwseftiiv.supabase.co";
  var KEY = "sb_publishable_rmuzJpYPrh0Sle4a4BZ1MA_tyKNknuT";

  // keepalive: o envio termina mesmo se a pessoa sair da página
  // logo depois (o formulário abre o WhatsApp em seguida).
  window.lynusSaveLead = function (lead) {
    return fetch(URL + "/rest/v1/site_leads", {
      method: "POST",
      keepalive: true,
      headers: {
        apikey: KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        nome: lead.nome,
        empresa: lead.empresa,
        porte: lead.porte || null,
        area: lead.area || null,
        pagina: location.pathname + location.search,
      }),
    }).catch(function () { /* sem internet: o WhatsApp ainda abre */ });
  };
})();
