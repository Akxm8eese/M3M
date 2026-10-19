import type {
  AnimalId,
  Catalog,
  ElementId,
  Food,
  LayerId,
  RealmId,
  SignRecord,
  SourceRecord,
} from "./types";

const n = (label: string, value: string) => ({ label, value });

const foods: Food[] = [
  {
    id: "walnut",
    name: "English walnuts",
    portion: "28 g, about 7 halves",
    preparation: "Raw or dry-roasted, with no added salt or glaze.",
    nutrients: [n("Energy", "about 185 kcal"), n("Protein", "about 4 g"), n("Fiber", "about 2 g")],
    allergens: ["Tree nuts"],
    allergenNote: "Tree nuts are a major food-allergen group.",
    boundaryNote: "A snack example for this chapter. No outcome is claimed for the head.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "strawberry",
    name: "Strawberries",
    portion: "150 g, about 1 cup of halves",
    preparation: "Rinsed, hulled, and eaten fresh.",
    nutrients: [n("Energy", "about 50 kcal"), n("Vitamin C", "about 90 mg"), n("Fiber", "about 3 g")],
    allergens: [],
    allergenNote: "No major food allergen is typical. Some people still react to strawberries.",
    boundaryNote: "Vitamin C is named as a nutrient in the fruit. No outcome is claimed.",
    sourceIds: ["usda-fdc", "nih-ods-vitc"],
  },
  {
    id: "yogurt",
    name: "Plain low-fat yogurt",
    portion: "170 g, about 1 cup",
    preparation: "Plain and unsweetened. The sample has no added fruit or honey.",
    nutrients: [n("Energy", "about 110 kcal"), n("Protein", "about 9 g"), n("Calcium", "present")],
    allergens: ["Milk"],
    allergenNote: "Milk is a major food-allergen group.",
    boundaryNote: "Calcium is present in this dairy food. No bone outcome is claimed.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "carrot",
    name: "Cooked carrots",
    portion: "80 g cooked",
    preparation: "Scrubbed or peeled, then boiled or steamed, with no sauce.",
    nutrients: [n("Energy", "about 30 kcal"), n("Fiber", "about 2 g"), n("Beta-carotene", "present")],
    allergens: [],
    allergenNote: "No major food allergen is typical.",
    boundaryNote: "Beta-carotene is a precursor the body can use to make vitamin A. No vision outcome is claimed.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "orange",
    name: "Orange",
    portion: "1 medium fruit, about 130 g",
    preparation: "Peeled and eaten fresh. The sample is the fruit, not juice.",
    nutrients: [n("Energy", "about 60 kcal"), n("Vitamin C", "about 70 mg"), n("Fiber", "about 3 g")],
    allergens: [],
    allergenNote: "No major food allergen is typical.",
    boundaryNote: "Vitamin C is named as a nutrient in the fruit. No outcome is claimed for breathing or the arms.",
    sourceIds: ["usda-fdc", "nih-ods-vitc"],
  },
  {
    id: "almond",
    name: "Almonds",
    portion: "28 g, about 23 kernels",
    preparation: "Raw or dry-roasted, unsalted.",
    nutrients: [n("Energy", "about 165 kcal"), n("Protein", "about 6 g"), n("Fat", "about 14 g")],
    allergens: ["Tree nuts"],
    allergenNote: "Tree nuts are a major food-allergen group.",
    boundaryNote: "A snack example only. No outcome is claimed for the shoulders or lungs.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "white-rice",
    name: "Cooked white rice",
    portion: "1 cup cooked, about 160 g",
    preparation: "Boiled or steamed in water, with no added fat in the sample.",
    nutrients: [n("Energy", "about 205 kcal"), n("Protein", "about 4 g"), n("Carbohydrate", "about 45 g")],
    allergens: [],
    allergenNote: "No major food allergen is typical.",
    boundaryNote: "A plain starch example for the stomach chapter. It is not a remedy.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "banana",
    name: "Banana",
    portion: "1 medium fruit, about 120 g",
    preparation: "Ripe, peeled, and eaten fresh.",
    nutrients: [n("Energy", "about 105 kcal"), n("Fiber", "about 3 g"), n("Potassium", "about 400 mg")],
    allergens: [],
    allergenNote: "No major food allergen is typical.",
    boundaryNote: "Potassium is named as a mineral in the fruit. No outcome is claimed.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "olive-oil",
    name: "Olive oil",
    portion: "1 tablespoon, about 14 g",
    preparation: "Used as a cooking fat or dressing. The sample is not a drink.",
    nutrients: [n("Energy", "about 120 kcal"), n("Fat", "about 14 g"), n("Monounsaturated fat", "most of the fat")],
    allergens: [],
    allergenNote: "No major food allergen is typical.",
    boundaryNote: "A fat example beside the heart chapter. No heart outcome is claimed.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "salmon",
    name: "Cooked salmon",
    portion: "85 g cooked",
    preparation: "Baked, grilled, or poached, without breading.",
    nutrients: [n("Energy", "about 180 kcal"), n("Protein", "about 17 g"), n("EPA and DHA", "present")],
    allergens: ["Fish"],
    allergenNote: "Fish is a major food-allergen group.",
    boundaryNote: "EPA and DHA are fats in the fish. No heart outcome is claimed.",
    sourceIds: ["usda-fdc", "nih-ods-omega3"],
  },
  {
    id: "lentil",
    name: "Cooked lentils",
    portion: "100 g cooked",
    preparation: "Rinsed, then simmered in water until soft.",
    nutrients: [n("Energy", "about 115 kcal"), n("Protein", "about 9 g"), n("Fiber", "about 8 g")],
    allergens: [],
    allergenNote: "No major food allergen is typical. Lentils are legumes, so a known legume allergy is a reason to skip them.",
    boundaryNote: "A fiber and protein example for the abdomen chapter. No digestive outcome is claimed.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "oats",
    name: "Rolled oats",
    portion: "40 g dry, before cooking",
    preparation: "Simmered in water. The portion is dry weight.",
    nutrients: [n("Energy", "about 150 kcal"), n("Protein", "about 5 g"), n("Fiber", "about 4 g")],
    allergens: [],
    allergenNote:
      "Oats are not themselves a major allergen group. Wheat cross-contact is common; people who avoid gluten need a product labeled for that.",
    boundaryNote: "A grain example only. No digestive outcome is claimed.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "cucumber",
    name: "Cucumber",
    portion: "100 g with peel",
    preparation: "Raw, rinsed, and sliced.",
    nutrients: [n("Energy", "about 15 kcal"), n("Water", "most of the weight"), n("Fiber", "about 1 g")],
    allergens: [],
    allergenNote: "No major food allergen is typical.",
    boundaryNote: "A water-rich food beside the kidney chapter. It does not clean the body.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "watermelon",
    name: "Watermelon",
    portion: "150 g",
    preparation: "Raw fruit, with or without small seeds.",
    nutrients: [n("Energy", "about 45 kcal"), n("Water", "most of the weight"), n("Carbohydrate", "about 11 g")],
    allergens: [],
    allergenNote: "No major food allergen is typical.",
    boundaryNote: "Another water-rich fruit. No kidney outcome is claimed.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "pumpkin-seed",
    name: "Pumpkin seeds",
    portion: "28 g shelled kernels",
    preparation: "Raw or dry-roasted, unsalted.",
    nutrients: [n("Energy", "about 160 kcal"), n("Protein", "about 8 g"), n("Magnesium and zinc", "present")],
    allergens: [],
    allergenNote: "No major food allergen is typical.",
    boundaryNote: "Minerals are named as present. No reproductive or urinary outcome is claimed.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "tomato",
    name: "Tomato",
    portion: "100 g raw",
    preparation: "Rinsed and sliced, with no added salt in the sample.",
    nutrients: [n("Energy", "about 18 kcal"), n("Vitamin C", "about 14 mg"), n("Potassium", "present")],
    allergens: [],
    allergenNote: "No major food allergen is typical.",
    boundaryNote: "A plant-food example for this chapter. No pelvic outcome is claimed.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "black-bean",
    name: "Cooked black beans",
    portion: "85 g cooked, about 1/2 cup",
    preparation: "Cooked from dried beans, or heated from plain canned beans and rinsed.",
    nutrients: [n("Energy", "about 110 kcal"), n("Protein", "about 8 g"), n("Fiber", "about 8 g")],
    allergens: [],
    allergenNote: "No major food allergen is typical. Beans are legumes, so a known legume allergy is a reason to skip them.",
    boundaryNote: "A protein and fiber example beside the hip chapter. No movement plan is prescribed.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "chickpea",
    name: "Cooked chickpeas",
    portion: "85 g cooked, about 1/2 cup",
    preparation: "Cooked and rinsed, with no sauce in the sample.",
    nutrients: [n("Energy", "about 130 kcal"), n("Protein", "about 7 g"), n("Fiber", "about 6 g")],
    allergens: [],
    allergenNote: "No major food allergen is typical. Chickpeas are legumes, so a known legume allergy is a reason to skip them.",
    boundaryNote: "A second legume example. No stretching plan is tied to this sign.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "kale",
    name: "Cooked kale",
    portion: "130 g cooked, about 1 cup",
    preparation: "Washed, then boiled or steamed. Stems are optional.",
    nutrients: [n("Energy", "about 40 kcal"), n("Vitamin K", "present"), n("Fiber", "about 3 g")],
    allergens: [],
    allergenNote: "No major food allergen is typical.",
    boundaryNote: "Vitamin K is named as a nutrient in the leaf. No medicine advice and no bone outcome are given.",
    sourceIds: ["usda-fdc", "nih-ods-vitk"],
  },
  {
    id: "beet",
    name: "Cooked beets",
    portion: "85 g cooked",
    preparation: "Boiled or steamed, then peeled if the skin was left on.",
    nutrients: [n("Energy", "about 40 kcal"), n("Folate", "present"), n("Carbohydrate", "about 8 g")],
    allergens: [],
    allergenNote: "No major food allergen is typical.",
    boundaryNote: "Folate is named as a vitamin in the root. No circulation outcome is claimed.",
    sourceIds: ["usda-fdc", "nih-ods-folate"],
  },
  {
    id: "sunflower-seed",
    name: "Sunflower seeds",
    portion: "28 g hulled kernels",
    preparation: "Unsalted, raw or dry-roasted.",
    nutrients: [n("Energy", "about 165 kcal"), n("Protein", "about 6 g"), n("Fat", "about 14 g")],
    allergens: [],
    allergenNote: "No major food allergen is typical.",
    boundaryNote: "A seed example beside the ankle chapter. No swelling or circulation advice is given.",
    sourceIds: ["usda-fdc"],
  },
  {
    id: "sardine",
    name: "Canned sardines in water",
    portion: "90 g drained",
    preparation: "Canned in water, drained, eaten as packaged. No sauce in the sample.",
    nutrients: [n("Energy", "about 180 kcal"), n("Protein", "about 20 g"), n("EPA and DHA", "present")],
    allergens: ["Fish"],
    allergenNote: "Fish is a major food-allergen group.",
    boundaryNote: "EPA and DHA are fats in the fish. No outcome is claimed for the feet.",
    sourceIds: ["usda-fdc", "nih-ods-omega3"],
  },
  {
    id: "brown-rice",
    name: "Cooked brown rice",
    portion: "1 cup cooked, about 200 g",
    preparation: "Boiled or steamed in water.",
    nutrients: [n("Energy", "about 215 kcal"), n("Protein", "about 5 g"), n("Fiber", "about 3 g")],
    allergens: [],
    allergenNote: "No major food allergen is typical.",
    boundaryNote: "A non-fish option in the same chapter, so the region is not tied to one allergen.",
    sourceIds: ["usda-fdc"],
  },
];

const salt = (name: string) => ({
  name,
  note: `${name} is a historical Schuessler tissue-salt name sometimes paired with this chapter in astrological teaching. It is not a measured nutrient, a suggested amount, or a check for a shortage. Element symbols on a salt are not nutrient amounts.`,
});

const signs: SignRecord[] = [
  {
    id: "aries",
    name: "Aries",
    region: "Head",
    latin: "Caput",
    element: "fire",
    realm: "Land",
    animal: "mammal",
    creature: "Ram",
    symbolicText:
      "In this teaching, Aries is the traditional chapter for the head and the ram. That pairing is symbolism. It is not evidence that a birth sign changes the skull.",
    natureMetaphor:
      "The ram meets what is in front of it. The image is about approach. It does not describe how bone grows.",
    functionText:
      "The head contains the brain and the organs of sight, hearing, smell, and taste. The skull is the bony case around the brain.",
    tissueSalt: salt("Kali phosphoricum"),
    layers: {
      skin: "Scalp and facial skin cover the skull. Teaching diagrams often show thinner skin over the forehead than over the scalp.",
      muscle: "Muscles of the face and jaw move the mouth, eyes, and bite. They are grouped here, not drawn as surgical landmarks.",
      bone: "Frontal, parietal, and facial bones form the vault and the shape of the face. This mark is the region, not a measured skull.",
      fascia: "A thin sheet lies under the scalp. How far it links to the rest of the body depends on the model, and this sketch does not decide that.",
    },
    viewNote: "The head row is on both Front and Back. The face marks appear only on Front.",
    foodIds: ["walnut", "strawberry"],
  },
  {
    id: "taurus",
    name: "Taurus",
    region: "Neck and throat",
    latin: "Collum",
    element: "earth",
    realm: "Land",
    animal: "mammal",
    creature: "Bull",
    symbolicText:
      "Taurus is the traditional chapter for the neck and throat, with the bull as its creature. The pairing is tradition, not evidence about the airway.",
    natureMetaphor:
      "The bull is a land animal associated with weight and steadiness. The image is a metaphor for the chapter, not a description of the neck.",
    functionText:
      "The neck joins the head to the trunk. The airway, the food passage, blood vessels, and the spinal cord pass through it. The throat is the front of the neck.",
    tissueSalt: salt("Natrum sulphuricum"),
    layers: {
      skin: "Neck skin moves with turning the head. The front of the throat and the back of the neck are one region in this chapter.",
      muscle: "Large muscles on the back and sides of the neck support the head. Smaller muscles in front relate to swallowing.",
      bone: "The cervical vertebrae stack in the neck. This plate marks the column; it does not count or measure the bones.",
      fascia: "Sheets around the neck muscles are simplified to a dashed wrap. A full fascial map is not claimed.",
    },
    viewNote: "Front shows the throat side. Back shows the nape. Same chapter either way.",
    foodIds: ["yogurt", "carrot"],
  },
  {
    id: "gemini",
    name: "Gemini",
    region: "Shoulders, arms, and lungs",
    latin: "Membrum superius",
    element: "air",
    realm: "Land",
    animal: "human-figure",
    creature: "Twins",
    symbolicText:
      "Gemini is the traditional chapter for the shoulders, arms, hands, and lungs, with the twins as its figure. The link is symbolic.",
    natureMetaphor:
      "The twins are a pair, and the arms are a pair. The likeness is a teaching image, not a claim that the lungs come in a sign-based pattern.",
    functionText:
      "The shoulder girdle and arms let the hands reach and hold. The lungs sit in the chest near this region and move air during breathing.",
    tissueSalt: salt("Kali muriaticum"),
    layers: {
      skin: "Skin covers the shoulders and continues down the arms. Both arms belong to this one chapter.",
      muscle: "Shoulder and arm muscles lift and bend the limb. Chest muscles that help breathing are nearby and are only named, not isolated.",
      bone: "The collarbone, shoulder blade, and the long bones of the arm meet at the shoulder. The drawing keeps them as one band.",
      fascia: "A sleeve of connective tissue around the arm is suggested with dashes. It is not a measured chain.",
    },
    viewNote: "The outstretched arms sit in the Gemini row so the row is easy to select. They are not drawn to scale.",
    foodIds: ["orange", "almond"],
  },
  {
    id: "cancer",
    name: "Cancer",
    region: "Chest and stomach",
    latin: "Thorax",
    element: "water",
    realm: "Water",
    animal: "water-animal",
    creature: "Crab",
    symbolicText:
      "Cancer is the traditional chapter for the chest and stomach, with the crab as its creature. The shell image is not the anatomy of the rib cage.",
    natureMetaphor:
      "A crab carries a shell. Teachers use that as a house-like image for the chest. The ribs are bone, not a shell, and the metaphor should stay labeled as a metaphor.",
    functionText:
      "The chest wall surrounds the heart and lungs. The stomach sits in the upper abdomen and holds food during early digestion.",
    tissueSalt: salt("Calcarea fluorica"),
    layers: {
      skin: "Skin of the chest and upper abdomen covers this chapter on the front. The matching back row is the upper back.",
      muscle: "Chest-wall muscles help breathing and arm movement. Abdominal wall muscles begin lower in the chapter.",
      bone: "Ribs and the breastbone form the chest cage. The drawing uses a few lines to suggest them, not a rib count.",
      fascia: "A broad sheet over the chest is dashed. Whether it belongs to a named line is outside this sketch.",
    },
    viewNote: "The stomach sits on the front. Use Back for the upper back of the same chapter.",
    foodIds: ["white-rice", "banana"],
  },
  {
    id: "leo",
    name: "Leo",
    region: "Heart and thoracic spine",
    latin: "Cor",
    element: "fire",
    realm: "Land",
    animal: "mammal",
    creature: "Lion",
    symbolicText:
      "Leo is the traditional chapter for the heart and the mid-back, with the lion as its creature. Warmth and courage in that tradition are symbols, not cardiac findings.",
    natureMetaphor:
      "The lion is the land creature for this chapter. The metaphor is about the teaching story, not about the muscle of the heart.",
    functionText:
      "The heart pumps blood. It sits in the chest, slightly left of the midline. The thoracic spine is the back of this region.",
    tissueSalt: salt("Magnesia phosphorica"),
    layers: {
      skin: "Skin over the central chest and the mid-back belongs to this row on the schematic.",
      muscle: "Heart muscle is inside the chest. Back muscles cover the thoracic spine. They are different tissues in one traditional chapter.",
      bone: "The thoracic vertebrae and nearby ribs frame the heart. The heart mark on Front is a symbol of location, not a scan.",
      fascia: "Connective tissue around the heart and along the spine is not separated in this sketch. The dashes only say that a sheet exists in teaching models.",
    },
    viewNote:
      "On this equal-row schematic the heart mark sits in the Leo row. A reviewed plate would use a tighter anatomical position. Back shows the thoracic spine.",
    foodIds: ["olive-oil", "salmon"],
  },
  {
    id: "virgo",
    name: "Virgo",
    region: "Abdomen and intestines",
    latin: "Abdomen",
    element: "earth",
    realm: "Land",
    animal: "human-figure",
    creature: "Maiden",
    symbolicText:
      "Virgo is the traditional chapter for the abdomen and intestines, with the maiden or harvest figure as its image. Sorting and harvest are metaphors.",
    natureMetaphor:
      "Harvest imagery is about gathering and separating. Digestion also separates nutrients from residue, but that likeness is a teaching bridge, not a mechanism.",
    functionText:
      "The small and large intestines run through the abdomen and continue digestion and the handling of water. This names the region, not every loop of bowel.",
    tissueSalt: salt("Kali sulphuricum"),
    layers: {
      skin: "Abdominal skin covers the front of this chapter. It moves with breathing and posture.",
      muscle: "The abdominal wall is layered muscle on the front. Deeper gut muscle moves food along and is not drawn.",
      bone: "The spine and lower ribs border this region. The intestines themselves are soft tissue, so the bone plate only shows the frame.",
      fascia: "A sheet lines the abdominal wall in ordinary anatomy teaching. This dashed line is that idea, not a named chain.",
    },
    viewNote: "The intestines are a front-of-body topic. Back still selects the same chapter along the lower ribs.",
    foodIds: ["lentil", "oats"],
  },
  {
    id: "libra",
    name: "Libra",
    region: "Kidneys and lumbar region",
    latin: "Ren",
    element: "air",
    realm: "Sky",
    animal: "symbol",
    creature: "Scales",
    symbolicText:
      "Libra is the traditional chapter for the kidneys and lower back, with the scales as its symbol. Balance in that tradition is not a kidney test.",
    natureMetaphor:
      "Scales are a human-made symbol, not an animal. They stand for weighing two sides. They do not describe how the kidneys work.",
    functionText:
      "The kidneys sit against the back wall of the abdomen, one on each side. They help make urine. The sentence stops at that anatomy.",
    tissueSalt: salt("Natrum phosphoricum"),
    layers: {
      skin: "Skin of the flanks and lower back covers the kidney region. The organs sit deep to that skin.",
      muscle: "Back muscles lie behind the kidneys. The kidneys are not muscles.",
      bone: "Lumbar vertebrae and the lower ribs form the bony neighborhood. The kidneys sit in front of those back muscles.",
      fascia: "A fatty and fibrous bed around each kidney is often taught. The dashes mark that bed without claiming a chain model.",
    },
    viewNote: "The kidneys are easier to place on Back. Front marks the flank of the same chapter.",
    foodIds: ["cucumber", "watermelon"],
  },
  {
    id: "scorpio",
    name: "Scorpio",
    region: "Pelvis",
    latin: "Pelvis",
    element: "water",
    realm: "Land",
    animal: "arachnid",
    creature: "Scorpion",
    symbolicText:
      "Scorpio is the traditional chapter for the pelvis, with the scorpion as its creature. This demo names the region only. It does not discuss sexual, reproductive, or urinary decisions.",
    natureMetaphor:
      "The scorpion is a land arachnid. Its use here is a traditional emblem for the pelvic chapter, not a map of organs.",
    functionText:
      "The pelvis is the bony ring at the base of the trunk. It contains the bladder and the reproductive organs. This page names that ring and stops there.",
    tissueSalt: salt("Calcarea sulphurica"),
    layers: {
      skin: "Skin over the lower abdomen, hips, and sacrum bounds the pelvic chapter on this schematic.",
      muscle: "Pelvic-floor and hip-girdle muscles close and move the region. They are named as a group.",
      bone: "The hip bones and sacrum form the ring. The drawing shows the bowl, not individual joints.",
      fascia: "Pelvic connective tissue is complex. The dashed line admits that complexity and does not trace it.",
    },
    viewNote: "Front and Back both select the pelvic ring. No internal organs are drawn.",
    foodIds: ["pumpkin-seed", "tomato"],
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    region: "Hips and thighs",
    latin: "Coxa",
    element: "fire",
    realm: "Hybrid",
    animal: "hybrid",
    creature: "Centaur",
    symbolicText:
      "Sagittarius is the traditional chapter for the hips and thighs, with the centaur or archer as its figure. Range and travel are metaphors, not a training plan.",
    natureMetaphor:
      "The centaur is a hybrid: human figure and horse. The horse half is why this chapter uses hips and thighs as its picture. The creature is mythical.",
    functionText:
      "The hips join the thighs to the pelvis. The thigh bone and the muscles around it carry weight in standing and walking.",
    tissueSalt: salt("Silicea"),
    layers: {
      skin: "Skin of the hips and thighs covers the front and back of both limbs in this row.",
      muscle: "Large thigh muscles straighten and bend the knee and steady the hip. Left and right are one chapter.",
      bone: "The thigh bone runs from hip to knee. The hip joint is the meeting with the pelvis.",
      fascia: "A stocking-like sheath around the thigh is a common teaching image. Dashes stand in for it.",
    },
    viewNote: "Both thighs share one chapter. Selecting either side of the row selects Sagittarius.",
    foodIds: ["black-bean", "chickpea"],
  },
  {
    id: "capricorn",
    name: "Capricorn",
    region: "Knees",
    latin: "Genu",
    element: "earth",
    realm: "Hybrid",
    animal: "hybrid",
    creature: "Sea-goat",
    symbolicText:
      "Capricorn is the traditional chapter for the knees, bones, and joints, with the sea-goat as its creature. Structure in that tradition is a symbol, not an injury grade.",
    natureMetaphor:
      "The sea-goat is a hybrid of goat and fish. The chapter uses it as an emblem of climbing and form. It is not a joint model.",
    functionText:
      "The knee is the joint between the thigh bone and the shin. It bends and straightens the leg. This page does not grade pain or recommend care.",
    tissueSalt: salt("Calcarea phosphorica"),
    layers: {
      skin: "Skin over the kneecap and the back of the knee belongs to this row.",
      muscle: "Thigh muscles cross the knee to move it. The joint itself is not a muscle.",
      bone: "The end of the thigh bone, the top of the shin, and the kneecap meet here. They are marked, not measured.",
      fascia: "A broad sheet on the outer thigh reaches toward the knee in many teaching models. This sketch does not adopt one model.",
    },
    viewNote: "Front shows the kneecap side. Back shows the hollow of the knee. Same chapter.",
    foodIds: ["kale", "yogurt"],
  },
  {
    id: "aquarius",
    name: "Aquarius",
    region: "Ankles and calves",
    latin: "Tarsus",
    element: "air",
    realm: "Sky",
    animal: "human-figure",
    creature: "Water-bearer",
    symbolicText:
      "Aquarius is the traditional chapter for the ankles and lower legs, with the water-bearer as its figure. The water in that image is a symbol, not a claim about circulation or swelling.",
    natureMetaphor:
      "The water-bearer pours from a jar. Teachers use the pour as an image. It does not describe blood, lymph, or fluid in the ankle.",
    functionText:
      "The ankle joins the leg to the foot. Calf muscles reach toward the heel. This page does not assess swelling or circulation.",
    tissueSalt: salt("Natrum muriaticum"),
    layers: {
      skin: "Skin of the calf and ankle wraps the lower leg. Both legs are in this chapter.",
      muscle: "Calf muscles point the foot. Tendons cross the ankle and are only suggested.",
      bone: "The two shin bones meet the ankle bones. The drawing marks the narrowing, not each bone.",
      fascia: "A wrap around the calf is dashed. It is a sketch of a sheath, not a reviewed dissection.",
    },
    viewNote: "Ankles are the narrow band above the feet on both Front and Back.",
    foodIds: ["beet", "sunflower-seed"],
  },
  {
    id: "pisces",
    name: "Pisces",
    region: "Feet",
    latin: "Pes",
    element: "water",
    realm: "Water",
    animal: "water-animal",
    creature: "Fishes",
    symbolicText:
      "Pisces is the traditional chapter for the feet, with two fishes as its creature. The image is tradition. It is not a claim about lymph, posture, or pain.",
    natureMetaphor:
      "Two fishes tied together are the emblem. They belong to water. They are not a model of the arches of the foot.",
    functionText:
      "The foot meets the ground in standing and walking. It has many small bones. This page does not assess pain or footwear.",
    tissueSalt: salt("Ferrum phosphoricum"),
    layers: {
      skin: "Skin of the top and sole of the foot belongs to this last row. The sole is the ground side.",
      muscle: "Small foot muscles and tendons from the leg share this region. They are grouped.",
      bone: "Many small bones form the foot. The plate shows the shape of the foot, not a bone count.",
      fascia: "A thick band on the sole is often taught. The dashes say that a band is described in textbooks, without adopting a chain system.",
    },
    viewNote: "The foot row is the base of both plates. Toes point forward on Front and are hidden by the heel view on Back.",
    foodIds: ["sardine", "brown-rice"],
  },
];

const sources: SourceRecord[] = [
  {
    id: "usda-fdc",
    title: "USDA FoodData Central",
    locator: "https://fdc.nal.usda.gov/",
  },
  {
    id: "openstax-ap",
    title: "OpenStax Anatomy and Physiology 2e",
    locator: "https://openstax.org/books/anatomy-and-physiology-2e/pages/1-introduction",
  },
  {
    id: "nih-ods-vitc",
    title: "NIH Office of Dietary Supplements — Vitamin C",
    locator: "https://ods.od.nih.gov/factsheets/VitaminC-Consumer/",
  },
  {
    id: "nih-ods-omega3",
    title: "NIH Office of Dietary Supplements — Omega-3 fatty acids",
    locator: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-Consumer/",
  },
  {
    id: "nih-ods-vitk",
    title: "NIH Office of Dietary Supplements — Vitamin K",
    locator: "https://ods.od.nih.gov/factsheets/VitaminK-Consumer/",
  },
  {
    id: "nih-ods-folate",
    title: "NIH Office of Dietary Supplements — Folate",
    locator: "https://ods.od.nih.gov/factsheets/Folate-Consumer/",
  },
];

function foodClaimText(food: Food): string {
  const parts = food.nutrients.map((item) => `${item.label}: ${item.value}`).join("; ");
  return `${food.name}, ${food.portion}. ${parts}. ${food.boundaryNote}`;
}

export function buildCatalog(): Catalog {
  const claims = [
    ...signs.map((sign) => ({
      id: `${sign.id}-anatomy`,
      text: sign.functionText,
      sourceIds: ["openstax-ap"],
      reviewer: "",
      reviewedAt: "",
      status: "pending" as const,
      signId: sign.id,
    })),
    ...foods.map((food) => ({
      id: `${food.id}-nutrition`,
      text: foodClaimText(food),
      sourceIds: food.sourceIds,
      reviewer: "",
      reviewedAt: "",
      status: "pending" as const,
      foodId: food.id,
    })),
  ];

  return {
    version: "0.1.0-demo",
    contentStatus: "pending-review",
    statusNote:
      "Sample chapter copy for client review. The planning kit did not include the source manuscript or artwork. No named reviewer has approved these lines.",
    signs: signs.map((sign) => ({
      ...sign,
      claimIds: [`${sign.id}-anatomy`, ...sign.foodIds.map((id) => `${id}-nutrition`)],
    })),
    foods,
    claims,
    sources,
    assets: [
      {
        id: "schematic-body",
        path: "src/BodyFigure.tsx",
        license: "Original schematic drawn for this demo",
        rightsEvidence:
          "Drawn in this repository for the client-feedback prototype. Not a clinical plate and not cleared as production anatomy art.",
        approved: false,
      },
    ],
  };
}

export const catalog = buildCatalog();

export function foodById(id: string): Food | undefined {
  return catalog.foods.find((food) => food.id === id);
}

export function signById(id: string) {
  return catalog.signs.find((sign) => sign.id === id);
}

export function sourceById(id: string) {
  return catalog.sources.find((source) => source.id === id);
}

export function publicStrings(): string[] {
  const values: string[] = [catalog.statusNote];
  for (const sign of catalog.signs) {
    values.push(
      sign.region,
      sign.latin,
      sign.symbolicText,
      sign.natureMetaphor,
      sign.functionText,
      sign.tissueSalt.name,
      sign.tissueSalt.note,
      sign.viewNote,
      sign.creature,
      ...Object.values(sign.layers),
    );
  }
  for (const food of catalog.foods) {
    values.push(
      food.name,
      food.portion,
      food.preparation,
      food.allergenNote,
      food.boundaryNote,
      ...food.allergens,
      ...food.nutrients.flatMap((item) => [item.label, item.value]),
    );
  }
  for (const claim of catalog.claims) values.push(claim.text);
  return values;
}

export const FILTER_META = {
  element: { label: "Element", values: ["fire", "earth", "air", "water"] as ElementId[] },
  realm: { label: "Nature realm", values: ["Land", "Sky", "Water", "Hybrid"] as RealmId[] },
  animal: {
    label: "Animal or symbol",
    values: ["mammal", "human-figure", "water-animal", "arachnid", "hybrid", "symbol"] as AnimalId[],
  },
};

export const LAYER_ORDER: LayerId[] = ["skin", "muscle", "bone", "fascia"];
