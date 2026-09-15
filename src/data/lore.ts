import type { Locale } from '../i18n'

export interface Poem {
  title: string[]   // 简繁英日韩
  author: string[]  // 简繁英日韩
  dynasty: '唐' | '汉' | '秦'
  lines: string[][] // 每联五语
  place: string[]   // 关联地点（简繁英日韩）
}

export interface Anecdote {
  person: string[]  // 人物名（简繁英日韩）
  title: string[]   // 轶事标题（简繁英日韩）
  text: string[]    // 轶事正文（简繁英日韩）
  place: string[]   // 关联地点（简繁英日韩）
  lng?: number      // 地点经度（WGS84，用于点击定位）
  lat?: number      // 地点纬度（WGS84，用于点击定位）
}

// ── 古今诗词：咏长安 ──
export const POEMS: Poem[] = [
  {
    title: ['过华清宫绝句', '過華清宮絕句', 'Passing Huaqing Palace', '華清宮を過ぎる', '화청궁을 지나며'],
    author: ['杜牧', '杜牧', 'Du Mu', '杜牧', '두목'],
    dynasty: '唐',
    lines: [
      ['长安回望绣成堆，山顶千门次第开。', '長安回望繡成堆，山頂千門次第開。', "Looking back from Chang'an, brocade hills in tiers; on the summit, a thousand gates open one by one.", '長安を振り返れば錦が重なり、山頂の千門が次々と開く。', '장안을 돌아보니 수놓은 언덕이 겹치고, 산 정상의 천 문이 차례로 열린다.'],
      ['一骑红尘妃子笑，无人知是荔枝来。', '一騎紅塵妃子笑，無人知是荔枝來。', 'A single rider raises red dust — the consort smiles; none know it is lychees that come.', '一騎の紅塵に妃は笑む、これ茘枝と知る人はなし。', '한 기사가 붉은 먼지를 일으키자 비빈이 웃었다, 그것이 여지임을 아는 이 없었다.'],
    ],
    place: ['华清宫 · 骊山', '華清宮 · 驪山', 'Huaqing Palace · Mount Li', '華清宮 · 驪山', '화청궁 · 여산'],
  },
  {
    title: ['长安古意（节选）', '長安古意（節選）', 'The Old Spirit of Chang\'an (excerpt)', '長安古意（抄）', '장안고의(발췌)'],
    author: ['卢照邻', '盧照鄰', 'Lu Zhaolin', '盧照鄰', '노조린'],
    dynasty: '唐',
    lines: [
      ['长安大道连狭斜，青牛白马七香车。', '長安大道連狹斜，青牛白馬七香車。', "The great avenues of Chang'an thread the narrow lanes; black oxen, white horses, seven-fragrance carriages.", '長安の大通りは小路に連なり、青牛と白馬の七香車が通う。', '장안의 대로는 좁은 골목까지 이어지고, 푸른 소와 흰 말이 칠향차를 끈다.'],
      ['玉辇纵横过主第，金鞭络绎向侯家。', '玉輦縱橫過主第，金鞭絡繹向侯家。', 'Jade carriages crisscross past princely mansions; golden whips in endless file toward marquises\' homes.', '玉輦は縦横に主第を過ぎ、金鞭は絶え間なく侯家へ向かう。', '옥연은 왕래하며 주가를 지나고, 금편은 끊이지 않고 후가로 향한다.'],
    ],
    place: ['朱雀大街', '朱雀大街', 'Vermilion Bird Avenue', '朱雀大街', '주작대가'],
  },
  {
    title: ['饮中八仙歌（节选）', '飲中八仙歌（節選）', 'Song of the Eight Immortals of Wine (excerpt)', '飲中八仙歌（抄）', '음중팔선가(발췌)'],
    author: ['杜甫', '杜甫', 'Du Fu', '杜甫', '두보'],
    dynasty: '唐',
    lines: [
      ['李白斗酒诗百篇，长安市上酒家眠。', '李白斗酒詩百篇，長安市上酒家眠。', 'Li Bai: a dipper of wine, a hundred poems; he sleeps in the taverns of the Chang\'an market.', '李白は斗酒に詩百篇、長安の市の酒家に眠る。', '이백은 두주에 시 백 편을 짓고, 장안 시정의 주가에서 잔다.'],
      ['天子呼来不上船，自称臣是酒中仙。', '天子呼來不上船，自稱臣是酒中仙。', 'Summoned by the Son of Heaven, he will not board the boat — "Your subject is an immortal of wine," he says.', '天子が呼んでも船に乗らず、自ら臣は酒中の仙と称す。', '천자가 불러도 배에 오르지 않고, 스스로 신은 술 중의 선이라 이른다.'],
    ],
    place: ['东市 · 西市', '東市 · 西市', 'East & West Markets', '東市 · 西市', '동시 · 서시'],
  },
  {
    title: ['不第后赋菊', '不第後賦菊', 'Chrysanthemums After Failing the Exam', '落第後に菊を賦す', '낙제 후에 국화를 읊다'],
    author: ['黄巢', '黃巢', 'Huang Chao', '黃巢', '황소'],
    dynasty: '唐',
    lines: [
      ['待到秋来九月八，我花开后百花杀。', '待到秋來九月八，我花開後百花殺。', 'Wait till autumn, the eighth of the ninth month; when my flower opens, all others die.', '秋が来て九月八日、我が花の開いた後は百花皆しぼむ。', '가을이 와 구월 팔일이 되면, 내 꽃이 핀 뒤 백화는 모두 진다.'],
      ['冲天香阵透长安，满城尽带黄金甲。', '沖天香陣透長安，滿城盡帶黃金甲。', 'A sky-piercing host of fragrance will soak Chang\'an; the whole city clad in golden armor.', '天を衝く香陣は長安を貫き、満城ことごとく黄金の甲を帯ぶ。', '하늘을 뚫는 향진이 장안을 관통하고, 만성이 모두 황금 갑옷을 둘렀다.'],
    ],
    place: ['长安城', '長安城', 'Chang\'an City', '長安城', '장안성'],
  },
  {
    title: ['春望', '春望', 'Spring View', '春望', '춘망'],
    author: ['杜甫', '杜甫', 'Du Fu', '杜甫', '두보'],
    dynasty: '唐',
    lines: [
      ['国破山河在，城春草木深。', '國破山河在，城春草木深。', 'The state is broken; mountains and rivers remain. Spring in the city — grass and trees grow deep.', '国破れて山河あり、城春にして草木深し。', '나라는 무너져도 산하는 남아 있고, 성의 봄에 초목은 깊다.'],
      ['感时花溅泪，恨别鸟惊心。', '感時花濺淚，恨別鳥驚心。', 'Moved by the times, flowers shed my tears; hating separation, birds startle my heart.', '時に感じて花も涙を濺ぎ、別れを恨んで鳥も心を驚かす。', '시절에 감겨 꽃에 눈물이 튀고, 이별을 미워해 새도 마음을 놀란다.'],
    ],
    place: ['长安城 · 安史之乱', '長安城 · 安史之亂', 'Chang\'an · An Lushan Rebellion', '長安城 · 安史の乱', '장안성 · 안사의 난'],
  },
  {
    title: ['登科后', '登科後', 'After Passing the Imperial Exam', '登科の後', '등과 후에'],
    author: ['孟郊', '孟郊', 'Meng Jiao', '孟郊', '맹교'],
    dynasty: '唐',
    lines: [
      ['春风得意马蹄疾，一日看尽长安花。', '春風得意馬蹄疾，一日看盡長安花。', 'Riding the spring wind, my horse\'s hooves fly swift — in one day I see all the flowers of Chang\'an.', '春風に意気を得て馬蹄疾し、一日にして長安の花を見尽くす。', '봄바람에 뜻을 얻어 말발굽이 빨라, 하루에 장안의 꽃을 모두 본다.'],
    ],
    place: ['朱雀大街 · 曲江', '朱雀大街 · 曲江', 'Vermilion Bird Avenue · Qujiang', '朱雀大街 · 曲江', '주작대가 · 곡강'],
  },
  {
    title: ['少年行', '少年行', 'Song of Youth', '少年行', '소년행'],
    author: ['王维', '王維', 'Wang Wei', '王維', '왕유'],
    dynasty: '唐',
    lines: [
      ['新丰美酒斗十千，咸阳游侠多少年。', '新豐美酒斗十千，咸陽遊俠多少年。', 'Xinfeng\'s fine wine, ten thousand a dipper; the gallant youths of Xianyang — how young they are.', '新豊の美酒は斗十千、咸陽の遊侠は多くは少年。', '신풍의 미주는 두에 만전이요, 함양의 유협은 대개 소년이다.'],
      ['相逢意气为君饮，系马高楼垂柳边。', '相逢意氣為君飲，繫馬高樓垂柳邊。', 'Meeting in high spirits, we drink for you; our horses tethered by the tall tower\'s drooping willows.', '意気に相逢へば君が為に飲み、馬を高楼垂柳の辺に繋ぐ。', '의기로 만나 그대를 위해 마시고, 말을 높은 누각 수류버들 가에 매다.'],
    ],
    place: ['东市酒肆', '東市酒肆', 'East Market Taverns', '東市の酒肆', '동시 주사'],
  },
  {
    title: ['忆江上吴处士', '憶江上吳處士', 'Remembering Hermit Wu on the River', '江上の呉処士を憶う', '강상의 오처사를 기억하며'],
    author: ['贾岛', '賈島', 'Jia Dao', '賈島', '가도'],
    dynasty: '唐',
    lines: [
      ['秋风吹渭水，落叶满长安。', '秋風吹渭水，落葉滿長安。', 'Autumn wind blows on the Wei River; fallen leaves fill Chang\'an.', '秋風は渭水に吹き、落葉は長安に満つ。', '가을 바람은 위수에 불고, 낙엽은 장안에 가득하다.'],
    ],
    place: ['渭水 · 长安', '渭水 · 長安', 'Wei River · Chang\'an', '渭水 · 長安', '위수 · 장안'],
  },
  {
    title: ['长恨歌（节选）', '長恨歌（節選）', 'Song of Everlasting Sorrow (excerpt)', '長恨歌（抄）', '장한가(발췌)'],
    author: ['白居易', '白居易', 'Bai Juyi', '白居易', '백거이'],
    dynasty: '唐',
    lines: [
      ['回眸一笑百媚生，六宫粉黛无颜色。', '回眸一笑百媚生，六宮粉黛無顏色。', 'One glance back, one smile — a hundred charms are born; the powdered beauties of six palaces lose all their color.', '眸を振り返り一笑すれば百媚生じ、六宮の粉黛は色を失う。', '눈을 돌려 한 번 웃으면 백매가 생겨, 육궁의 분대는 빛을 잃는다.'],
      ['在天愿作比翼鸟，在地愿为连理枝。', '在天願作比翼鳥，在地願為連理枝。', 'In heaven, may we be birds flying wing to wing; on earth, branches twined as one.', '天に在りては比翼の鳥と作らんことを、地に在りては連理の枝と為らんことを願う。', '하늘에서는 비익의 새가 되고, 땅에서는 연리의 가지가 되기를 바란다.'],
    ],
    place: ['华清宫 · 兴庆宫', '華清宮 · 興慶宮', 'Huaqing & Xingqing Palaces', '華清宮 · 興慶宮', '화청궁 · 흥경궁'],
  },
  {
    title: ['秋兴八首（其一）', '秋興八首（其一）', 'Autumn Meditations (I)', '秋興八首（その一）', '추흥팔수(그 하나)'],
    author: ['杜甫', '杜甫', 'Du Fu', '杜甫', '두보'],
    dynasty: '唐',
    lines: [
      ['丛菊两开他日泪，孤舟一系故园心。', '叢菊兩開他日淚，孤舟一繫故園心。', 'The clustered chrysanthemums have bloomed twice since my tears of other days; one lone boat tethers my heart to the garden of home.', '叢菊は両度開いて他日の涙、孤舟は一つに故園の心を繋ぐ。', '무리 국화는 두 번 피어 지난날의 눈물이고, 외로운 배 하나가 고향 마음을 매어둔다.'],
    ],
    place: ['长安 · 江峡', '長安 · 江峽', 'Chang\'an · River Gorges', '長安 · 江峡', '장안 · 강협'],
  },
]

// ── 名人轶事：长安人物 ──
export const ANECDOTES: Anecdote[] = [
  {
    person: ['李白', '李白', 'Li Bai', '李白', '이백'],
    title: ['醉草吓蛮书', '醉草嚇蠻書', 'Drafting the Barbarian Letter Drunk', '酔って蛮書を草す', '취하여 만서를 초하다'],
    text: [
      '传说玄宗时番邦送来国书，满朝无人识得番字。贺知章荐李白入宫，李白宿醉未醒，命高力士脱靴、杨国忠磨墨，挥笔以番文回书，番使慑服。此即"醉草吓蛮书"，虽出自小说家言，却是长安酒文化最豪放的一笔。',
      '傳說玄宗時番邦送來國書，滿朝無人識得番字。賀知章薦李白入宮，李白宿醉未醒，命高力士脫靴、楊國忠磨墨，揮筆以番文回書，番使懾服。此即「醉草嚇蠻書」，雖出自小說家言，卻是長安酒文化最豪放的一筆。',
      'Legend says a foreign state sent a letter no courtier could read. He Zhizhang recommended Li Bai, who — still drunk from the night before — demanded Gao Lishi remove his boots and Yang Guozhong grind the ink, then dashed off a reply in the foreign tongue so forceful the envoys submitted. Though from fiction, it is Chang\'an\'s boldest drinking tale.',
      '玄宗の時、異国から誰も読めない国書が届いた。賀知章が李白を推挙し、宿酔の李白は高力士に靴を脱がせ、楊国忠に墨を磨かせ、異国の文字で返書をしたためた。使節は恐れ服したという。小説家の作だが、長安の酒文化最も豪放な一頁である。',
      '현종 때 번방에서 아무도 읽지 못하는 국서를 보내왔다. 하지장이 이백을 천거했고, 숙취가 남은 이백은 고력사에게 신을 벗기고 양국충에게 먹을 갈게 한 뒤 번문으로 회서를 써 내려가 사신을 복종시켰다. 소설가의 말이지만 장안 주류 문화의 가장 호방한 한 획이다.',
    ],
    place: ['兴庆宫 · 沉香亭', '興慶宮 · 沉香亭', 'Xingqing Palace · Aloeswood Pavilion', '興慶宮 · 沈香亭', '흥경궁 · 침향정'],
    lng: 108.9940, lat: 34.2555,
  },
  {
    person: ['玄奘', '玄奘', 'Xuanzang', '玄奘', '현장'],
    title: ['偷渡玉门关，孤身求法', '偷渡玉門關，孤身求法', 'Sneaking Past Yumen Pass, Seeking the Law Alone', '玉門関を抜け、独り法を求む', '옥문관을 몰래 나와 홀로 법을 구하다'],
    text: [
      '贞观三年，玄奘申请西行未获批准，遂混入饥民队伍偷渡玉门关，孤身穿越八百里流沙，"四夜五日无一滴沾喉"。十九年后携经六百余部东归，太宗亲迎于长安，敕建大慈恩寺译经——今日大雁塔，即其藏经译经之所。',
      '貞觀三年，玄奘申請西行未獲批准，遂混入饑民隊伍偷渡玉門關，孤身穿越八百里流沙，「四夜五日無一滴沾喉」。十九年後攜經六百餘部東歸，太宗親迎於長安，敕建大慈恩寺譯經——今日大雁塔，即其藏經譯經之所。',
      'In 629, Xuanzang\'s request to travel west was denied, so he slipped past Yumen Pass among famine refugees and crossed eight hundred li of shifting sands alone — "four nights, five days, not a drop wet my throat." Nineteen years later he returned with over 600 scriptures; Taizong welcomed him to Chang\'an and built Dacien Temple for his translations. The Great Wild Goose Pagoda was his scriptorium.',
      '貞観三年、玄奘の西行申請は許されず、饑民の群れに紛れて玉門関を抜け、八百里の流砂を独り越えた——「四夜五日、一滴も喉を潤さず」。十九年後に六百余部の経典を携えて帰り、太宗は自ら長安で迎え、大慈恩寺を建てて訳経させた。今日の大雁塔がその蔵経訳経の場である。',
      '정관 3년, 현장의 서행 신청은 허락되지 않자 기민 무리에 섞여 옥문관을 빠져나와 팔백 리 유사를 홀로 건넸다——"사흘 밤 나흘 날 한 방울도 목을 적시지 못했다". 19년 뒤 6백여 부의 경전을 가지고 돌아오자 태종이 장안에서 직접 맞이하고 대자은사를 지어 번경케 했다. 오늘날 대안탑이 그 장소다.',
    ],
    place: ['大慈恩寺', '大慈恩寺', 'Dacien Temple', '大慈恩寺', '대자은사'],
    lng: 108.9640, lat: 34.2185,
  },
  {
    person: ['空海', '空海', 'Kūkai', '空海', '공해'],
    title: ['青龙寺求法，书道开山', '青龍寺求法，書道開山', 'Seeking the Dharma at Qinglong Temple', '青龍寺で法を求め、書道の開祖に', '청룡사에서 구법하고 서도를 개창하다'],
    text: [
      '日本僧空海入唐求学，师从青龙寺惠果阿阇梨，尽得密教真传。归国后创真言宗，其书法融唐风于和样，被尊为"五笔和尚"——传世《风信帖》至今是日本书道至宝。青龙寺遗址在今乐游原上，建有空海纪念碑。',
      '日本僧空海入唐求學，師從青龍寺惠果阿闍梨，盡得密教真傳。歸國後創真言宗，其書法融唐風於和樣，被尊為「五筆和尚」——傳世《風信帖》至今是日本書道至寶。青龍寺遺址在今樂遊原上，建有空海紀念碑。',
      'The Japanese monk Kūkai came to Tang China and studied under Huiguo at Qinglong Temple, receiving the full esoteric transmission. Back home he founded the Shingon school; his calligraphy fused Tang style with Japanese sensibility, earning him the title "monk of five brushes" — his Wind and Cloud letters remain treasures of Japanese calligraphy. The Qinglong Temple site on Leyou Plain bears a Kūkai memorial.',
      '日本の僧空海は入唐し、青龍寺の恵果阿闍梨に師事して密教の真伝を尽く受けた。帰国後は真言宗を開き、その書は唐風を和様に融かし「五筆和尚」と尊称された——現存『風信帖』は今も日本書道の至宝である。青龍寺跡は今の楽遊原にあり、空海記念碑が立つ。',
      '일본 승려 공해는 입당하여 청룡사 혜과 아사리에게 배워 밀교의 진전을 모두 얻었다. 귀국 후 진언종을 열었고, 그 서법은 당풍을 화양에 융합해 "오필화상"으로 존칭받았다——전해지는 풍신첩은 일본 서도의 보물이다. 청룡사 유적은 지금 낙유원에 있고 공해 기념비가 서 있다.',
    ],
    place: ['青龙寺 · 新昌坊', '青龍寺 · 新昌坊', 'Qinglong Temple · Xinchang Ward', '青龍寺 · 新昌坊', '청룡사 · 신창방'],
    lng: 108.9953, lat: 34.2336,
  },
  {
    person: ['贺知章', '賀知章', 'He Zhizhang', '賀知章', '하지장'],
    title: ['金龟换酒', '金龜換酒', 'Trading the Golden Turtle for Wine', '金亀を換えて酒とす', '금귀를 술로 바꾸다'],
    text: [
      '贺知章官至秘书监，佩三品金龟袋。初见李白，读《蜀道难》未毕，连称"谪仙人也"，解下金龟换酒，与李白痛饮竟日。后人以此喻豪爽好客——长安城里，最不缺的就是诗与酒的相逢。',
      '賀知章官至秘書監，佩三品金龜袋。初見李白，讀《蜀道難》未畢，連稱「謫仙人也」，解下金龜換酒，與李白痛飲竟日。後人以此喻豪爽好客——長安城裡，最不缺的就是詩與酒的相逢。',
      'He Zhizhang, Keeper of the Imperial Library, wore the golden turtle of the third rank. On first meeting Li Bai, before finishing "The Hard Road to Shu," he exclaimed "a banished immortal!" — and untied his golden turtle to trade for wine, drinking with Li Bai all day. The tale became a byword for open-hearted hospitality: in Chang\'an, poetry and wine always found each other.',
      '賀知章は秘書監に至り、三品の金亀袋を佩いていた。初めて李白に会い、『蜀道難』を読み終えぬうちに「謫仙人なり」と連称し、金亀を解いて酒に換え、李白と終日痛飲した。後人はこれをもって豪爽好客の例えとする——長安の城内で、最も欠けないのは詩と酒の相逢である。',
      '하지장은 비서감에 이르렀고 삼품 금귀대를 차고 있었다. 이백을 처음 만나 촉도난을 다 읽기도 전에 "적선인이라" 연신 부르고 금귀를 풀어 술로 바꾸어 이백과 종일 크게 마셨다. 후인들이 이를 호협함의 비유로 삼았다——장안성에 가장 부족하지 않은 것이 시와 술의 만남이었다.',
    ],
    place: ['长安酒肆', '長安酒肆', 'The Taverns of Chang\'an', '長安の酒肆', '장안의 주사'],
    lng: 108.9800, lat: 34.2560,
  },
  {
    person: ['武则天', '武則天', 'Wu Zetian', '武則天', '무측천'],
    title: ['无字碑', '無字碑', 'The Wordless Stele', '無字碑', '무자비'],
    text: [
      '乾陵前立碑一通，通体无一字，世称"无字碑"。武则天遗言"己之功过，留后人评"，故不着一字。千余年来，后人于碑上题刻渐满，反成唐碑中刻字最多者——她的功过，终究由后人写了满满一碑。',
      '乾陵前立碑一通，通體無一字，世稱「無字碑」。武則天遺言「己之功過，留後人評」，故不著一字。千餘年來，後人於碑上題刻漸滿，反成唐碑中刻字最多者——她的功過，終究由後人寫了滿滿一碑。',
      'Before the Qianling Mausoleum stands a stele with no inscription at all — the Wordless Stele. Wu Zetian decreed that her merits and faults be left for posterity to judge, so not a word was carved. Over a thousand years, later visitors gradually covered it with their own inscriptions, making it the most-inscribed Tang stele of all: her legacy was written by others, and fully.',
      '乾陵の前に一字も刻まれない碑が立つ、世に「無字碑」と称される。武則天は「己の功過は後人の評に委ねる」と遺言し、一字も著さなかった。千余年の間に後人の題刻で満たされ、かえって唐碑で最も多く刻字された碑となった——彼女の功過は、結局後人によって一碑いっぱいに書かれたのである。',
      '건릉 앞에 한 자도 새겨지지 않은 비가 서 있으니, 세상이 무자비라 부른다. 무측천은 "자신의 공과 과는 후인의 평가에 맡긴다"는 유언을 남겨 한 자도 쓰지 않았다. 천여 년간 후인들의 제각으로 가득 차려 오히려 당비 중 가장 많이 새겨진 비가 되었다——그녀의 공과는 끝내 후인들이 비 하나 가득 썼다.',
    ],
    place: ['乾陵', '乾陵', 'Qianling Mausoleum', '乾陵', '건릉'],
    lng: 108.4757, lat: 34.5731,
  },
  {
    person: ['柳公权', '柳公權', 'Liu Gongquan', '柳公権', '유공권'],
    title: ['心正则笔正', '心正則筆正', 'An Upright Heart Makes an Upright Brush', '心正しければ筆正し', '마음이 바르면 붓도 바르다'],
    text: [
      '穆宗问柳公权用笔之法，答曰："用笔在心，心正则笔正。"穆宗知其以笔谏也。柳体骨力清劲，与颜体并称"颜筋柳骨"——今西安碑林，藏柳书《玄秘塔碑》，学书者朝圣之地。',
      '穆宗問柳公權用筆之法，答曰：「用筆在心，心正則筆正。」穆宗知其以筆諫也。柳體骨力清勁，與顏體並稱「顏筋柳骨」——今西安碑林，藏柳書《玄秘塔碑》，學書者朝聖之地。',
      'Emperor Muzong asked Liu Gongquan the secret of the brush. "The brush follows the heart," he replied; "an upright heart makes an upright brush." The emperor understood it as counsel. Liu\'s taut, sinewy style pairs with Yan Zhenqing\'s as "Yan\'s muscle, Liu\'s bone" — the Forest of Steles in Xi\'an keeps his Xuanmi Pagoda Stele, a pilgrimage site for calligraphers.',
      '穆宗が柳公権に用筆の法を問うと、「用筆は心に在り、心正しければ筆正し」と答えた。穆宗はそれが筆による諫言だと悟った。柳体は骨力清勁で、顔体と並び「顔筋柳骨」と称される——今の西安碑林には柳書『玄秘塔碑』が蔵され、学書者の聖地である。',
      '목종이 유공권에게 용필의 법을 묻자 "용필은 마음에 있고, 마음이 바르면 붓도 바릅니다"라고 답했다. 목종은 이것이 붓으로 간언함임을 알았다. 유체는 골력이 청경하여 안체와 함께 안근유골이라 불린다——지금 서안 비림에는 유공권의 현비탑비가 소장되어 학서자들의 성지가 되었다.',
    ],
    place: ['西安碑林', '西安碑林', 'Xi\'an Forest of Steles', '西安碑林', '시안 비림'],
    lng: 108.9404, lat: 34.2545,
  },
  {
    person: ['杜牧', '杜牧', 'Du Mu', '杜牧', '두목'],
    title: ['十年一觉扬州梦', '十年一覺揚州夢', 'Ten Years, One Dream of Yangzhou', '十年一覚揚州の夢', '십년 일각 양주의 꿈'],
    text: [
      '杜牧才气纵横，却仕途失意，曾在扬州幕府流连酒肆，写"十年一觉扬州梦，赢得青楼薄幸名"。晚年回首长安，把一腔郁气都付与华清宫绝句——"一骑红尘妃子笑"，讽的是荔枝，叹的其实是整个盛唐。',
      '杜牧才氣縱橫，卻仕途失意，曾在揚州幕府流連酒肆，寫「十年一覺揚州夢，贏得青樓薄幸名」。晚年回首長安，把一腔鬱氣都付與華清宮絕句——「一騎紅塵妃子笑」，諷的是荔枝，嘆的其實是整個盛唐。',
      'Du Mu, brilliant but frustrated in office, lingered in Yangzhou\'s taverns and wrote, "Ten years, one dream of Yangzhou — all I won was a rake\'s reputation." In later years he poured his bitterness into the Huaqing quatrain: "a single rider, red dust, the consort smiles" — satirizing lychees, but mourning the whole High Tang.',
      '杜牧は才気縦横でありながら宦途に失意し、揚州の幕府で酒肆に通い、「十年一覚揚州の夢、贏ち得たり青楼に薄幸の名」と詠んだ。晩年長安を振り返り、鬱積を華清宮の絶句に託した——「一騎紅塵妃子笑む」、諷するは茘枝、嘆ずるは実に盛唐全体である。',
      '두목은 재기가 종횡했으나 관도에 뜻을 이루지 못해 양주 막부에서 주사를 전전하며 "십년 일각 양주의 꿈, 청루에 박행의 이름만 얻었다"고 썼다. 만년에 장안을 돌아보며 울분을 화청궁 절구에 쏟았다——"한 기사 붉은 먼지에 비빈이 웃고", 풍자한 것은 여지였으나 탄식한 것은 사실 전체 성당이었다.',
    ],
    place: ['华清宫', '華清宮', 'Huaqing Palace', '華清宮', '화청궁'],
    lng: 109.2120, lat: 34.3620,
  },
  {
    person: ['太平公主', '太平公主', 'Princess Taiping', '太平公主', '태평공주'],
    title: ['权力顶峰的陨落', '權力頂峰的隕落', 'A Fall from the Summit of Power', '権力の頂からの隕落', '권력의 정상에서 떨어지다'],
    text: [
      '太平公主权倾朝野，七位宰相五位出其门下。先天二年，与李隆基争权失败，逃入山寺三日，还政后赐死于家。其府邸旧址在长安平康坊一带——政治的旋涡中心，也曾是这座城最繁华的坊曲。',
      '太平公主權傾朝野，七位宰相五位出其門下。先天二年，與李隆基爭權失敗，逃入山寺三日，還政後賜死於家。其府邸舊址在長安平康坊一帶——政治的漩渦中心，也曾是這座城最繁華的坊曲。',
      'Princess Taiping\'s power filled the court: five of seven chancellors rose through her patronage. In 713, her power struggle with Li Longji failed; she fled to a mountain temple for three days, then was ordered to die at home. Her mansion stood in what was Pingkang Ward — the whirlpool of politics, once among the city\'s liveliest quarters.',
      '太平公主は権勢朝野に満ち、七人の宰相のうち五人がその門下から出た。先天二年、李隆基との権力争いに敗れ、山寺に三日逃れた後、家で死を賜った。その邸宅跡は長安の平康坊一帯にあった——政治の渦の中心も、かつてはこの城で最も繁華な坊曲だったのである。',
      '태평공주는 권력이 조야에 가득해 일곱 재상 중 다섯이 그녀의 문하에서 나왔다. 선천 2년 이융기와 권력 다툼에 실패해 산사에 사흘 숨었다가 집에서 사사되었다. 그 저택 터는 장안 평강방 일대에 있었다——정치 소용돌이의 중심도 한때 이 성에서 가장 번화한 방곡이었다.',
    ],
    place: ['平康坊', '平康坊', 'Pingkang Ward', '平康坊', '평강방'],
    lng: 108.9570, lat: 34.2530,
  },
  {
    person: ['王维', '王維', 'Wang Wei', '王維', '왕유'],
    title: ['诗佛的辋川', '詩佛的輞川', 'The Buddha of Poetry at Wangchuan', '詩仏の輞川', '시불의 망천'],
    text: [
      '王维半官半隐，晚年得宋之问蓝田别墅，改筑辋川别业，与裴迪泛舟唱和，成《辋川集》二十首。"行到水穷处，坐看云起时"——长安的诗人里，他把仕途与山水平衡得最好，人尊"诗佛"。',
      '王維半官半隱，晚年得宋之問藍田別墅，改築輞川別業，與裴迪泛舟唱和，成《輞川集》二十首。「行到水窮處，坐看雲起時」——長安的詩人裡，他把仕途與山水平衡得最好，人尊「詩佛」。',
      'Wang Wei lived half-official, half-hermit. In later life he rebuilt Song Zhiwen\'s Lantian villa as his Wangchuan estate, drifting on the water exchanging poems with Pei Di — twenty poems became the Wangchuan Collection. "Walk to where the water ends; sit and watch the clouds rise." Of all Chang\'an\'s poets, he balanced career and landscape best — the "Buddha of Poetry."',
      '王維は半官半隠の暮らしを送り、晩年宋之問の藍田別荘を得て輞川別業に改築し、裴迪と舟を泛べて唱和し『輞川集』二十首を成した。「水の窮まりに至れば、座して雲の起こるを看る」——長安の詩人の中で、彼は仕途と山水の均衡を最もよく保ち、「詩仏」と尊ばれた。',
      '왕유는 반관반은으로 살다 만년에 송지문의 남전 별장을 얻어 망천별업으로 고쳐 짓고 배적과 배를 띄워 창화하여 망천집 20수를 이루었다. "물 끝에 이르면 앉아 구름 일어남을 본다"——장안의 시인 중 그는 관도와 산수의 균형을 가장 잘 이루어 시불로 존경받았다.',
    ],
    place: ['辋川 · 蓝田', '輞川 · 藍田', 'Wangchuan · Lantian', '輞川 · 藍田', '망천 · 남전'],
    lng: 109.3187, lat: 34.1512,
  },
  {
    person: ['阿倍仲麻吕', '阿倍仲麻呂', 'Abe no Nakamaro', '阿倍仲麻呂', '아베노 나카마로'],
    title: ['身在长安，名成异国', '身在長安，名成異國', 'A Life Made in Chang\'an, a Name in Two Realms', '身は長安に在り、名は異国に成る', '몸은 장안에 있고 이름은 두 나라에 남다'],
    text: [
      '日本遣唐留学生阿倍仲麻吕，入唐五十四年，仕玄宗至秘书监，汉名"晁衡"，与李白王维为友。归国途中遇风漂至安南，李白误闻其死，作《哭晁卿衡》"明月不归沉碧海"。他辗转重回长安，终老于斯——一座城的包容，莫过于此。',
      '日本遣唐留學生阿倍仲麻呂，入唐五十四年，仕玄宗至秘書監，漢名「晁衡」，與李白王維為友。歸國途中遇風漂至安南，李白誤聞其死，作《哭晁卿衡》「明月不歸沉碧海」。他輾轉重回長安，終老於斯——一座城的包容，莫過於此。',
      'The Japanese student Abe no Nakamaro spent fifty-four years in Tang China, rising to Keeper of the Imperial Library under Xuanzong, taking the Chinese name Chao Heng, friends with Li Bai and Wang Wei. Storms blew his homeward ship to Annam; Li Bai, told he had died, wrote "The bright moon, unreturning, sinks in the blue sea." He made his way back to Chang\'an and died there — no city was more generous.',
      '日本の遣唐留学生阿倍仲麻呂は入唐五十四年、玄宗に仕えて秘書監に至り、漢名を「晁衡」と称し、李白や王維と友となった。帰国の途で嵐に遭い安南に漂着した際、死を誤聞した李白は『晁卿衡を哭す』「明月帰らずして碧海に沈む」を詠んだ。彼は輾転して長安に戻り、そこで没した——一座城の寛容は、ここに過ぎるものはない。',
      '일본 견당 유학생 아베노 나카마로는 입당 54년간 현종을 섬겨 비서감에 이르렀고 한명은 조형이며 이백·왕유와 벗했다. 귀국길에 풍랑을 만나 안남에 표류하자, 죽었다는 오보를 들은 이백은 곡조경형에서 "밝은 달 돌아오지 않아 벽해에 가라앉는다"고 읊었다. 그는 우여곡절 끝에 장안으로 돌아와 그곳에서 생을 마쳤다——한 도시의 포용은 이에 지나지 않는다.',
    ],
    place: ['长安城', '長安城', 'Chang\'an City', '長安城', '장안성'],
    lng: 108.9070, lat: 34.2569,
  },
  {
    person: ['韩愈', '韓愈', 'Han Yu', '韓愈', '한유'],
    title: ['一封谏书，雪拥蓝关', '一封諫書，雪擁藍關', 'One Memorial, Snowbound at Blue Pass', '一通の諫書、雪は藍関を塞ぐ', '한 통의 간서, 눈이 남관을 덮다'],
    text: [
      '唐宪宗迎佛骨入宫，举国若狂。刑部侍郎韩愈上书极谏，触怒天子，几乎被处死，贬为潮州刺史。行至蓝关，大雪拥途，他写下"云横秦岭家何在？雪拥蓝关马不前"——一句之间，直臣的孤愤与贬客的乡愁都写尽了。',
      '唐憲宗迎佛骨入宮，舉國若狂。刑部侍郎韓愈上書極諫，觸怒天子，幾乎被處死，貶為潮州刺史。行至藍關，大雪擁途，他寫下「雲橫秦嶺家何在？雪擁藍關馬不前」——一句之間，直臣的孤憤與貶客的鄉愁都寫盡了。',
      'When Emperor Xianzong welcomed the Buddha\'s relic into the palace and the realm went mad with devotion, Han Yu, Vice Minister of Justice, dared a blistering memorial. He narrowly escaped execution and was banished to Chaozhou. Halting at Blue Pass in the snow, he wrote: "Clouds bar the Qinling — where is my home? Snow heaps the pass — my horse will not go on." In one couplet, an upright minister\'s bitterness and an exile\'s homesickness, complete.',
      '唐の憲宗が仏骨を宮中に迎え入れると、国中が熱狂した。刑部侍郎韓愈は極諫の上表を行い、天子の怒りに触れて死罪寸前、潮州刺史に左遷された。藍関に至ると大雪が道を塞ぎ、「雲は秦嶺に横たわり家はいずこ、雪は藍関を塞ぎ馬は進まず」と詠んだ——一聯のうちに、直臣の孤憤と遠謫の人の望郷を書き尽くしている。',
      '당 헌종이 불골을 궁중으로 맞아들이자 온 나라가 광적으로 들떴다. 형부시랑 한유는 극간하는 상소를 올려 천자의 노여움을 사 사형 직전까지 갔다가 조주자사로 좌천되었다. 남관에 이르러 큰눈이 길을 막자 "구름은 진령에 가로뉘어 집은 어디메뇨, 눈은 남관을 덮으니 말이 앞으로 나아가지 못하네"라고 썼다 —— 한 구절에 직신의 고분과 귀양객의 향수를 모두 써냈다.',
    ],
    place: ['蓝关 · 潮州道', '藍關 · 潮州道', 'Blue Pass · the road to Chaozhou', '藍関 · 潮州への道', '남관 · 조주로 가는 길'],
    lng: 109.2961, lat: 34.0762,
  },
  {
    person: ['马可·波罗', '馬可·波羅', 'Marco Polo', 'マルコ・ポーロ', '마르코 폴로'],
    title: ['游记里的长安与安西王府', '遊記裡的長安與安西王府', "Chang'an and the Anxi Palace in the Travels", '紀行記の中の長安と安西王府', '여행기 속 장안과 안서왕부'],
    text: [
      '元代马可·波罗游历长安，在游记中写道："在古代，这是一个幅员辽阔、非常强盛的王国的首都，是许多著名君王的驻跸之所。"他还记述城郊忙哥剌的安西王府——"结构整齐匀称，装饰华丽，有许多的喷泉和池塘，真是美不可言。"',
      '元代馬可·波羅遊歷長安，在遊記中寫道：「在古代，這是一個幅員遼闊、非常強盛的王國的首都，是許多著名君王的駐蹕之所。」他還記述城郊忙哥剌的安西王府——「結構整齊勻稱，裝飾華麗，有許多的噴泉和池塘，真是美不可言。」',
      'Visiting Chang\'an under the Yuan, Marco Polo wrote: "In ancient times this was the capital of a kingdom vast in extent and very mighty, the residence of many famous kings." Of Prince Anxi\'s palace on the plain outside the city he recorded: "well laid out and symmetrical in structure, richly adorned, with many fountains and ponds — beautiful beyond words."',
      '元代に長安を訪れたマルコ・ポーロは『東方見聞録』に記した。「古の昔、ここは広大で非常に強盛な王国の都であり、多くの名だたる君主たちの駐蹕の地であった」。さらに城外の忙哥剌の安西王府について「構えは整って釣り合いがとれ、装飾は華麗で、多くの噴水と池があり、まことに言葉に尽くせぬ美しさだ」と書き留めた。',
      '원대에 장안을 여행한 마르코 폴로는 여행기에 이렇게 썼다. "옛날 이곳은 광대하고 매우 강성한 왕국의 수도로, 유명한 군주들이 머물던 곳이었다." 그는 성곽 밖 망골라의 안서왕부에 대해서도 "구조가 가지런하고 균형 잡히며 장식이 화려하고, 수많은 분수와 연못이 있어 가히 말로 다 할 수 없이 아름답다"고 기록했다.',
    ],
    place: ['安西王府', '安西王府', 'Anxi Palace', '安西王府', '안서왕부'],
    lng: 108.9503, lat: 34.3969,
  },
  {
    person: ['唐玄宗', '唐玄宗', 'Emperor Xuanzong of Tang', '唐玄宗', '당 현종'],
    title: ['梨园祖师', '梨園祖師', 'The Patriarch of the Pear Garden', '梨園の祖師', '리원의 조사(祖師)'],
    text: [
      '唐玄宗亲选乐工三百，教习于梨园，号称"皇帝梨园弟子"——这是我国历史上最早的音乐戏曲专门学校，玄宗亲自执掌教习，后世戏曲艺人遂尊其为"祖师"，艺人至今自称"梨园行"。',
      '唐玄宗親選樂工三百，教習於梨園，號稱「皇帝梨園弟子」——這是我國歷史上最早的音樂戲曲專門學校，玄宗親自執掌教習，後世戲曲藝人遂尊其為「祖師」，藝人至今自稱「梨園行」。',
      'Emperor Xuanzong personally picked three hundred musicians and trained them at the Pear Garden — the "Emperor\'s Pear Garden disciples." It was China\'s first dedicated academy of music and opera, with the emperor himself as master; actors ever since have honored him as their founding patriarch and call their profession "the Pear Garden line."',
      '唐の玄宗は自ら楽工三百人を選び、梨園で教習させ、「皇帝梨園弟子」と号した——わが国史上最初の音楽・戯曲の専門学校である。玄宗自ら教習を掌り、後世の役者たちは彼を「祖師」と仰ぎ、芸人たちは今も自らを「梨園行」と称する。',
      '당 현종은 직접 악공 300인을 뽑아 리원(梨園)에서 가르치게 하고 "황제 리원 제자"라 불렀다 —— 이는 우리 역사상 최초의 음악·희곡 전문 학교로, 현종이 친히 교습을 맡았다. 후세 희곡 예인들은 그를 "조사(祖師)"로 받들고, 예인들은 지금도 스스로 "리원행(梨園行)"이라 이른다.',
    ],
    place: ['梨园 · 禁苑', '梨園 · 禁苑', 'The Pear Garden · imperial grounds', '梨園 · 禁苑', '리원 · 금원'],
    lng: 108.9450, lat: 34.2850,
  },
]


// ── 诗人踪迹：坊宅与常往之地 ──
export interface PoetStop {
  fang: string                 // 坊名（对应坊矩阵）
  kind: 'residence' | 'place'  // 坊宅 / 常往地
  label: string                // 地点名（常乐坊东亭 / 大慈恩寺…）
  period?: string              // 年代区间（坊宅）
  event: string                // 事迹
  poemRef?: string             // 诗文出处
}

export interface Poet {
  id: string
  name: string
  courtesy: string
  era: string
  color: string                // 轨迹色
  stops: PoetStop[]            // 按时间/游踪排序
}

export const POETS: Poet[] = [
  {
    id: 'baijuyi', name: '白居易', courtesy: '乐天', era: '772–846',
    color: '#c8544c',
    stops: [
      { fang: '常乐', kind: 'residence', label: '常乐坊东亭', period: '803–815 贞元十九年—元和十年', event: '初入长安，赁居此坊种竹自娱。', poemRef: '《养竹记》「常乐里闲居」' },
      { fang: '新昌', kind: 'residence', label: '新昌坊', period: '815–821 元和十年—长庆元年', event: '自江州司马还朝，迁居新昌。坊近青龙寺，东南即曲江。', poemRef: '《新昌新居》「地偏坊远鼓迟迟」' },
      { fang: '宣阳', kind: 'residence', label: '宣阳坊', period: '821–823 长庆元年—长庆三年', event: '穆宗召还，知制诰时居此。近东市，交通便利。', poemRef: '《宣阳坊闲居》' },
      { fang: '新昌', kind: 'residence', label: '新昌坊', period: '827–829 大和元年—大和三年', event: '文宗朝拜秘书监，复居新昌。', poemRef: '《新昌闲居》' },
      { fang: '晋昌', kind: 'place', label: '大慈恩寺', event: '游赏登塔，与元稹同登。', poemRef: '「慈恩塔上题名处，十七人中最少年」' },
      { fang: '崇仁', kind: 'place', label: '崇仁坊酒肆', event: '近东市，宴饮常往。' },
      { fang: '平康', kind: 'place', label: '平康坊北里', event: '新科进士曲江宴后常游。' },
    ],
  },
  {
    id: 'libai', name: '李白', courtesy: '太白', era: '701–762',
    color: '#5a7bb5',
    stops: [
      { fang: '胜业', kind: 'residence', label: '翰林院（大明宫侧）', period: '742–744 天宝初', event: '奉诏入京，供奉翰林，日夕待诏。', poemRef: '《清平调》「云想衣裳花想容」' },
      { fang: '崇仁', kind: 'place', label: '崇仁坊胡姬酒肆', event: '近东市，胡姬酒肆林立。', poemRef: '《少年行》「笑入胡姬酒肆中」' },
      { fang: '平康', kind: 'place', label: '平康坊酒肆', event: '长安酒肆聚集之地。' },
      { fang: '晋昌', kind: 'place', label: '大慈恩寺', event: '登塔远眺。' },
      { fang: '醴泉', kind: 'place', label: '醴泉坊胡寺', event: '近西市，胡风最盛。' },
    ],
  },
  {
    id: 'dufu', name: '杜甫', courtesy: '子美', era: '712–770',
    color: '#7b6843',
    stops: [
      { fang: '宣阳', kind: 'residence', label: '宣阳坊', period: '746–755 天宝五载—十四载', event: '初至长安求仕，困居十年。', poemRef: '《奉赠韦左丞丈》「朝扣富儿门，暮随肥马尘」' },
      { fang: '晋昌', kind: 'place', label: '大慈恩寺', event: '与高适、岑参同登慈恩塔。', poemRef: '《同诸公登慈恩寺塔》「高标跨苍穹」' },
      { fang: '新昌', kind: 'place', label: '曲江 · 杏园', event: '春日游赏，对酒赋诗。', poemRef: '《曲江二首》「一片花飞减却春」' },
      { fang: '务本', kind: 'place', label: '国子监', event: '曾监考国子监。' },
      { fang: '亲仁', kind: 'place', label: '亲仁坊', event: '陈兼、高适等人居此，往来交游。' },
    ],
  },
]

// ── 互动猜诗：诗中觅坊 ──
export interface Clue {
  id: string
  poetId: string
  difficulty: 1 | 2 | 3
  prompt: string       // 题面（引诗句）
  hint: string         // 提示
  answerFang: string   // 答案坊名
}

export const CLUES: Clue[] = [
  { id: 'clue-bjy-01', poetId: 'baijuyi', difficulty: 1, prompt: '「常乐里闲居，始植竹于此」——某诗人初入长安，赁居此坊种竹自娱。这是哪个坊？', hint: '此坊在朱雀大街东侧', answerFang: '常乐' },
  { id: 'clue-bjy-02', poetId: 'baijuyi', difficulty: 2, prompt: '「慈恩塔上题名处，十七人中最少年」——新科进士在何处题名？', hint: '大雁塔所在的坊', answerFang: '晋昌' },
  { id: 'clue-lb-01', poetId: 'libai', difficulty: 1, prompt: '「笑入胡姬酒肆中」——胡姬酒肆在哪个坊？', hint: '此坊近东市', answerFang: '崇仁' },
  { id: 'clue-lb-02', poetId: 'libai', difficulty: 2, prompt: '「云想衣裳花想容」——此诗作于李白供奉翰林时，翰林院靠近哪个坊？', hint: '翰林院在大明宫侧，此坊近兴庆宫', answerFang: '胜业' },
  { id: 'clue-df-01', poetId: 'dufu', difficulty: 1, prompt: '「高标跨苍穹，烈风无时休」——杜甫与诸公同登此塔，塔在哪个坊？', hint: '此坊名有「昌」字', answerFang: '晋昌' },
  { id: 'clue-df-02', poetId: 'dufu', difficulty: 2, prompt: '「一片花飞减却春」——曲江春暮，杜甫在此赏花饮酒。曲江在哪个坊附近？', hint: '曲江在此坊东南', answerFang: '新昌' },
  { id: 'clue-df-03', poetId: 'dufu', difficulty: 3, prompt: '「朝扣富儿门，暮随肥马尘」——杜甫困居长安十年，最初住在哪个坊？', hint: '万年县廨所在之坊', answerFang: '宣阳' },
]
// 便捷取值（与 tr() 一致：zh-CN=0, zh-TW=1, en=2, ja=3, ko=4）
export const LORE_INDEX: Record<Locale, number> = {
  'zh-CN': 0, 'zh-TW': 1, en: 2, ja: 3, ko: 4,
}
