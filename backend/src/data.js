const portraitImages = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&h=1200&q=80"
];

const memoryImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&h=1200&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&h=900&q=80",
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&h=1000&q=80",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&h=1150&q=80",
  "https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=1000&h=750&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&h=1150&q=80"
];

const img = (index) => portraitImages[index % portraitImages.length];

export const people = [
  {
    id: "aurora-vilela",
    fullName: "Aurora Vilela de Sousa",
    knownAs: "Aurora Vilela",
    birthDate: "1921-03-14",
    deathDate: "2004-08-02",
    biography:
      "Cantora de radio nas noites de Recife, Aurora gravou apenas dois discos e centenas de programas ao vivo que nunca foram arquivados. Dizem que sua voz atravessava o vinil como se estivesse na sala. Guardava cadernos com letras copiadas a mao e um bilhete que dizia: guardem as fotografias, elas cantam tambem.",
    city: "Recife",
    country: "Brasil",
    category: "Música",
    coverPhotoUrl: img(0),
    featured: true,
    createdAt: "2024-01-12"
  },
  {
    id: "ilo-bernardes",
    fullName: "Ilo Bernardes Caetano",
    knownAs: "Seu Ilo",
    birthDate: "1934-07-09",
    deathDate: "2011-11-27",
    biography:
      "Projecionista de cinema de rua por quarenta e um anos. Conheceu o som de cada bobina e o silencio das plateias vazias das sessoes de segunda-feira. Levava para casa fotogramas descartados e colava-os em albuns escolares.",
    city: "Santos",
    country: "Brasil",
    category: "Cinema",
    coverPhotoUrl: img(1),
    featured: true,
    createdAt: "2024-02-03"
  },
  {
    id: "clarice-do-amaral",
    fullName: "Clarice do Amaral Prado",
    knownAs: "Clarice Prado",
    birthDate: "1946-05-21",
    deathDate: "2019-04-16",
    biography:
      "Escreveu contos curtos publicados em suplementos de jornal e uma novela nunca editada. Trabalhou por trinta anos como bibliotecaria e catalogou, a mao, o acervo inteiro de uma cidade pequena.",
    city: "Ouro Preto",
    country: "Brasil",
    category: "Literatura",
    coverPhotoUrl: img(2),
    featured: true,
    createdAt: "2024-02-19"
  },
  {
    id: "benedito-rocha",
    fullName: "Benedito Rocha Marinho",
    knownAs: "Bene",
    birthDate: "1928-09-30",
    deathDate: "1998-01-05",
    biography:
      "Pintor de fachadas e letreiros. Assinava cada trabalho com um ponto vermelho escondido em algum canto. Deixou centenas de esbocos em papel de embrulho.",
    city: "Salvador",
    country: "Brasil",
    category: "Arte",
    coverPhotoUrl: img(3),
    createdAt: "2024-03-04"
  },
  {
    id: "nadir-fontes",
    fullName: "Nadir Fontes de Lima",
    knownAs: "Nadir Fontes",
    birthDate: "1951-12-02",
    biography:
      "Nadadora de aguas abertas, atravessou o canal entre duas ilhas aos dezenove anos com uma touca emprestada. Treinava antes do amanhecer e voltava a pe, molhada, cumprimentando os pescadores.",
    city: "Florianopolis",
    country: "Brasil",
    category: "Esporte",
    coverPhotoUrl: img(4),
    createdAt: "2024-03-21"
  },
  {
    id: "otavio-machado",
    fullName: "Otavio Machado Ferreira",
    birthDate: "1917-06-11",
    deathDate: "1989-10-08",
    biography:
      "Ferroviario e cronista informal da estacao. Anotava em cadernetas os nomes de quem partia e de quem voltava. As cadernetas sobreviveram; a estacao, nao.",
    city: "Bauru",
    country: "Brasil",
    category: "História",
    coverPhotoUrl: img(5),
    createdAt: "2024-04-02"
  },
  {
    id: "maria-eulalia",
    fullName: "Maria Eulalia dos Santos",
    knownAs: "Vo Lala",
    birthDate: "1930-01-25",
    deathDate: "2016-07-19",
    biography:
      "Cozinhou para sete geracoes da mesma familia e para todos os vizinhos em dias de chuva. Guardava receitas em envelopes de conta de luz e fotografias dentro da caixa de costura.",
    city: "Juazeiro do Norte",
    country: "Brasil",
    category: "Família",
    coverPhotoUrl: img(6),
    featured: true,
    createdAt: "2024-04-18"
  },
  {
    id: "joaquim-teles",
    fullName: "Joaquim Teles Barbosa",
    knownAs: "Quincas Teles",
    birthDate: "1940-02-08",
    deathDate: "2007-05-30",
    biography:
      "Sanfoneiro de forro de terreiro. Tocou em casamentos por quatro decadas sem nunca cobrar de noivos sem dinheiro. A sanfona verde esta com o neto.",
    city: "Caruaru",
    country: "Brasil",
    category: "Música",
    coverPhotoUrl: img(7),
    createdAt: "2024-05-06"
  },
  {
    id: "helena-vasques",
    fullName: "Helena Vasques Ribeiro",
    knownAs: "Lena",
    birthDate: "1958-08-17",
    biography:
      "Fotografa de bairro. Retratou batizados, formaturas e mudancas com uma camera de fole herdada do pai. Revelava no banheiro de casa, com a porta selada por uma toalha.",
    city: "Porto Alegre",
    country: "Brasil",
    category: "Arte",
    coverPhotoUrl: img(8),
    createdAt: "2024-05-27"
  },
  {
    id: "amancio-pires",
    fullName: "Amancio Pires do Vale",
    birthDate: "1925-11-04",
    deathDate: "2003-02-14",
    biography:
      "Professor primario em escola rural de uma sala so. Ensinou tres geracoes a ler usando jornais velhos e giz cortado ao meio.",
    city: "Diamantina",
    country: "Brasil",
    category: "História",
    coverPhotoUrl: img(9),
    createdAt: "2024-06-11"
  },
  {
    id: "teresa-albuquerque",
    fullName: "Teresa de Albuquerque Nunes",
    knownAs: "Tereza Nunes",
    birthDate: "1963-04-29",
    biography:
      "Montadora de cinema documental. Passou anos ordenando imagens de outras pessoas e quase nunca apareceu em uma. Costuma dizer que montar e escolher o que merece durar.",
    city: "Lisboa",
    country: "Portugal",
    category: "Cinema",
    coverPhotoUrl: img(10),
    createdAt: "2024-07-01"
  },
  {
    id: "sebastiao-lourenco",
    fullName: "Sebastiao Lourenco Braga",
    knownAs: "Tiao",
    birthDate: "1936-10-13",
    deathDate: "2013-09-09",
    biography:
      "Marceneiro. Fez as carteiras da escola, os bancos da praca e o proprio caixao, que recusou usar por achar cedo demais. Deixou uma oficina cheia de moldes numerados.",
    city: "Tiradentes",
    country: "Brasil",
    category: "Outras",
    coverPhotoUrl: img(11),
    createdAt: "2024-07-22"
  }
];

const photoSeeds = [
  ["Retrato feito em estudio de bairro, provavelmente em um domingo de manha.", "Decada de 1950", "Estudio Photo Ideal", "Autor desconhecido", [900, 1200]],
  ["Reuniao de familia no quintal. A fotografia estava colada num album de capa verde.", "1968 (aproximado)", "Casa da rua do Sol", "Arquivo da familia", [1200, 900]],
  ["Dia de trabalho. O negativo foi recuperado de uma caixa de sapatos.", "Decada de 1970", "Centro da cidade", "Autor desconhecido", [1000, 1000]],
  ["Viagem de trem registrada por um amigo com camera emprestada.", "1974", "Estacao central", "Registro de amigo proximo", [1200, 800]],
  ["Ultima fotografia conhecida em cores, desbotada pelo tempo.", "Decada de 1990", "Varanda de casa", "Arquivo pessoal", [900, 1150]],
  ["Detalhe de objeto pessoal guardado por decadas em uma gaveta.", "Data desconhecida", "Acervo domestico", "Doacao de familiar", [1000, 750]]
];

export const photos = people.flatMap((person, personIndex) =>
  Array.from({ length: 4 + (personIndex % 3) }, (_, index) => {
    const [description, approximateDate, location, author, ratio] = photoSeeds[index % photoSeeds.length];
    return {
      id: `${person.id}-photo-${index + 1}`,
      personId: person.id,
      url: memoryImages[(personIndex + index) % memoryImages.length],
      description,
      approximateDate,
      location: `${location}, ${person.city}`,
      author,
      createdAt: person.createdAt
    };
  })
);

const storyTemplates = [
  {
    title: "O caderno na primeira gaveta",
    content:
      "Encontramos um caderno de capa dura na primeira gaveta da comoda. Estava cheio de anotacoes sobre dias comuns: o preco do pao, a chuva, o nome de quem passou para visitar. Nada extraordinario, e por isso mesmo impossivel de substituir.",
    author: "Registro da familia",
    year: "2018"
  },
  {
    title: "A voz que ficou na sala",
    content:
      "Quem conviveu diz que o mais dificil de descrever e o som: o jeito de rir no meio da frase, o modo de chamar pelo nome inteiro quando estava contente. Nao existe fotografia disso, entao escrevemos.",
    author: "Depoimento de vizinho",
    year: "2020"
  },
  {
    title: "Domingo de manha",
    content:
      "Todo domingo a casa enchia. Ninguem combinava, simplesmente acontecia. A mesa era pequena demais e ninguem nunca reclamou. Quando a casa foi vendida, foi essa mesa que a familia fez questao de levar.",
    author: "Neta",
    year: "2021"
  }
];

export const stories = people.flatMap((person, index) =>
  storyTemplates.slice(0, 2 + (index % 2)).map((template, storyIndex) => ({
    id: `${person.id}-story-${storyIndex + 1}`,
    personId: person.id,
    title: template.title,
    content: template.content,
    author: template.author,
    year: template.year,
    createdAt: person.createdAt
  }))
);

export const user = {
  id: "user-1",
  name: "Marina Contreiras",
  email: "marina.contreiras@exemplo.com",
  city: "Belo Horizonte, Brasil",
  memberSince: "2024-03-08",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80"
};
