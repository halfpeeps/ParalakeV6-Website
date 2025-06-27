const titleBanner = document.getElementById('title-banner');
const mainBackground = document.getElementById('background');
const authorLabel = document.getElementById('author');
const logo = document.getElementById('logo');
const imageFolder = "loading/bg_images/";
const timeBetweenImages = 10000;
const BG1 = document.getElementById("BG1");
const BG2 = document.getElementById("BG2");

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
    }
}

//------------------------------images---------------------------------
const imageData = [
    { name: "race.jpg", author: "Super_" },
    { name: "night.jpg", author: "Super_" },
    { name: "pd-sunset.jpg", author: "Super_" },
    { name: "physgun.jpg", author: "Super_" },
    { name: "clay-pigeon.jpg", author: "Rogue" },
    { name: "inspect.jpg", author: "Super_" },
    { name: "roof.jpg", author: "Super_" },
    { name: "tfu-sniper.jpg", author: "Super_" },
    { name: "tfu-sniper-night.jpg", author: "Super_" },
    { name: "dusk.jpg", author: "Super_" },
    { name: "bank-robbery2.jpg", author: "Exnem" },
    { name: "raid.jpg", author: "Exnem" },
    { name: "anniversary.jpg", author: "Super_" },
    { name: "2fast.jpg", author: "Super_" },
    { name: "gas-station.jpg", author: "Super_" },
    { name: "business.jpg", author: "Super_" },
    { name: "defence.jpg", author: "Super_" },
    { name: "v6forest.jpg", author: "peeps" },
    { name: "v6highway.jpg", author: "peeps" },
    { name: "v6hungriges.jpg", author: "peeps" },
    { name: "v6office.jpg", author: "peeps" },
    { name: "v6office2.jpg", author: "peeps" },
    { name: "v6pumpingstation.jpg", author: "peeps" },
    { name: "v6regals.jpg", author: "peeps" },
    { name: "v6smoke.jpg", author: "peeps" },
    { name: "v6tunnel.jpg", author: "peeps" },
    { name: "v6citypark.jpg", author: "peeps" },
    { name: "v6citypark2.jpg", author: "peeps" },
    { name: "v6crimescene.jpg", author: "peeps" },
    { name: "v6slums.jpg", author: "peeps" },
    { name: "v6tenement.jpg", author: "peeps" },
    { name: "v6homeless.jpg", author: "peeps" },
    { name: "v6commstower.jpg", author: "peeps" },
    { name: "v6foundry.jpg", author: "peeps" },
    { name: "v6foundry_corridor.jpg", author: "peeps" },
    { name: "v6lecturn.jpg", author: "peeps" },
    { name: "v6library.jpg", author: "peeps" },
    { name: "v6projector.jpg", author: "peeps" },
    { name: "v6pub.jpg", author: "peeps" },
    { name: "v6vaultopening.jpg", author: "peeps" },
    { name: "sniperAmmo.jpg", author: "sm3321" },
];

let current = 0;
let showingBG1 = true;

function showImage(index) {
    const img = imageData[index];
    const url = `url('${imageFolder}${img.name}')`;

    const nextBG = showingBG1 ? BG2 : BG1;
    const currentBG = showingBG1 ? BG1 : BG2;

    nextBG.style.backgroundImage = url;
    nextBG.classList.add("active");
    currentBG.classList.remove("active");

    authorLabel.textContent = `${img.author}`;
    showingBG1 = !showingBG1;
}

function nextImage() {
    current = (current + 1) % imageData.length;
    showImage(current);
}

shuffle(imageData);

//------------------------------hints---------------------------------
const hints = [
    { title: "GAMEPLAY TIP", description: "Pressing F1 will bring up your main control panel, where you can review the rules, add gene points to your preferred stats and much more." },
    { title: "GAMEPLAY TIP", description: "If you think somebody has broken the rules, press F6 to make a report and describe the situation in detail." },
    { title: "GAMEPLAY TIP", description: "If there's a shootout nearby that you're not involved in, you should run away for your own safety." },
    { title: "GAMEPLAY TIP", description: "Some weapon attachments help with recoil control or visuals." },
    { title: "GAMEPLAY TIP", description: "Aim down your sights for improved accuracy." },
    { title: "GAMEPLAY TIP", description: "Bandaging will make you vulnerable to being rushed, be careful with your timing!" },
    { title: "GAMEPLAY TIP", description: "Never stand too close to a possible explosion." },
    { title: "GAMEPLAY TIP", description: "Try to negotiate things out first before shooting." },
    { title: "GAMEPLAY TIP", description: "Stimpacks can be used to regenerate health faster." },
    { title: "GAMEPLAY TIP", description: "Always follow orders while under gunpoint." },
    { title: "GAMEPLAY TIP", description: "Don't forget to bring bandages if you think you might get in a fight!" },
    { title: "GAMEPLAY TIP", description: "Crowbars make a lot of noise compared to a bobby pin." },
    { title: "GAMEPLAY TIP", description: "Avoid carrying too many illegal items on you in case the police search you." },
    { title: "GAMEPLAY TIP", description: "Fishing or getting a job is the best way to make money if you're new." },
    { title: "GAMEPLAY TIP", description: "If you don't want somebody to be revived, put a bullet in their head once they are unconscious." },
    { title: "GAMEPLAY TIP", description: "Consider buying a house alarm if you are worried about getting raided." },
    { title: "GAMEPLAY TIP", description: "As a firefighter, take the large fire truck when responding to fires." },
    { title: "GAMEPLAY TIP", description: "To clean up bodies as a medic, you will require a large ambulance." },
    { title: "GAMEPLAY TIP", description: "To search people as a Police Officer, take your fists out and press reload." },
    { title: "GAMEPLAY TIP", description: "To drag cuffed people as a Police Officer, take your fists out and right click the cuffed person." },
    { title: "GAMEPLAY TIP", description: "When responding to an emergency, press shift to toggle your lights, and Q to toggle your sirens." },
    { title: "GAMEPLAY TIP", description: "If you ever need help from the police, you will have to use the 911 app on your phone." },
    { title: "GAMEPLAY TIP", description: "When you respawn, remember you will have \"New Life Rule\" (NLR) and forget about your past life!" },
    { title: "GAMEPLAY TIP", description: "Always try to have a phone on you, buy one from any gas station around the map." },
    { title: "GAMEPLAY TIP", description: "Be careful of meth getting too hot, it might explode!" },

    { title: "GAMEPLAY TIP", description: "You can leave your job and spawn as a civilian while you are dead by typing /resign in chat." },
    { title: "GAMEPLAY TIP", description: "You can use a wrench to fix a damaged or disabled car." },
    { title: "GAMEPLAY TIP", description: "If you need extra help use /help or create a help and support using F6 to ask any questions." },
    { title: "GAMEPLAY TIP", description: "Cooking fish is the best way to fix your hunger!" },
    { title: "GAMEPLAY TIP", description: "You can try out guns at the firing range from the Blaze it store!" },
    { title: "GAMEPLAY TIP", description: "You can apply for the Police Department at plpd.online/careers." },
    { title: "GAMEPLAY TIP", description: "You can create your own organization at the City Hall." },
    { title: "GAMEPLAY TIP", description: "You can change certain keybinds by pressing F1." },
    { title: "GAMEPLAY TIP", description: "Any items that you have equipped will drop upon death." },
    { title: "GAMEPLAY TIP", description: "You can keep track of the taxes and paychecks by opening the City Info app on your phone." },
    { title: "GAMEPLAY TIP", description: "You can toggle mute the government radio by pressing H." },
    { title: "GAMEPLAY TIP", description: "You can call roadcrew by dialing 565 on your phone or /rc in text chat." },
    { title: "GAMEPLAY TIP", description: "You can call the taxi by dialing 232 on your phone or /taxi in text chat." },
    { title: "GAMEPLAY TIP", description: "You can deposit or withdraw money from any ATM around the map." },
    { title: "GAMEPLAY TIP", description: "There are 15 different locations around the map where the drug dealer can be, who moves every few hours." },
    { title: "GAMEPLAY TIP", description: "If you are warranted, you can hand yourself in at the Police Department for a reduced sentence." },
    { title: "GAMEPLAY TIP", description: "You can get a full list of cars and their details at cars.perpheads.com" },
    { title: "GAMEPLAY TIP", description: "A car bomb will explode shortly after the engine is turned on." },
    { title: "GAMEPLAY TIP", description: "Buying premium has several benefits, such as premium cars, clothing accessories, extra free casino spin and more." },
    { title: "GAMEPLAY TIP", description: "You can buy premium for in-game money, simply ask in the OOC chat." },
    { title: "GAMEPLAY TIP", description: "If you become crippled, you can either visit the hospital, or ask a medic to fix your legs." },
    { title: "GAMEPLAY TIP", description: "If you believe an officer acted unlawfully, make a complaint with evidence on plpd.online/new-complaint." },
    { title: "GAMEPLAY TIP", description: "You can buy extra genetics for your character at the hospital." },
    { title: "GAMEPLAY TIP", description: "If there is no road crew, you can still fix your car at the roadcrew station by talking to the NPC." },
    { title: "GAMEPLAY TIP", description: "You can see how much you are being paid by opening the console and looking for the green text." },
    { title: "GAMEPLAY TIP", description: "You can use the map application on your phone to navigate your way around the city." },
    { title: "GAMEPLAY TIP", description: "It takes 4 charges on your defibrillator as a medic to revive somebody." },
    { title: "GAMEPLAY TIP", description: "You can combine water from your water tanks by left clicking them in your inventory." },
    { title: "GAMEPLAY TIP", description: "You can fill ammo boxes from other boxes by left clicking on them in your inventory." },
    { title: "GAMEPLAY TIP", description: "Take the Paralake Metro to quickly get around the city" },
    { title: "GAMEPLAY TIP", description: "You can drag a body by right clicking a limb with your fists out." },
    { title: "GAMEPLAY TIP", description: "If you died to a bug, or found a bug make a report informing staff and file a bug report on the forums" },
    { title: "GAMEPLAY TIP", description: "You can purchase a car at the Business Car Dealer for as low as $1,000." },
    { title: "GAMEPLAY TIP", description: "Check out the guides on our help website! Visit https://help.perpheads.com/" },

    { title: "GAMEPLAY TIP", description: "If your friend is unconscious you can transport them to Hospital to revive them." },
    { title: "GAMEPLAY TIP", description: "Press E with your fists to check the pulse of an unconscious person." },
    { title: "GAMEPLAY TIP", description: "Before selling your car make sure to downgrade and sell any upgrades at Collier's Auto Shop." },
    { title: "GAMEPLAY TIP", description: "As a Firefighter, you can attempt CPR with your fists by pressing reload." },
    { title: "GAMEPLAY TIP", description: "When using basic planters, you do not need any water." },
    { title: "GAMEPLAY TIP", description: "When using an advanced planter, keeping the water on LOW will provide more yield, and HIGH will provide less." },
    { title: "GAMEPLAY TIP", description: "You should value your life over your items no matter the situation." },
    { title: "GAMEPLAY TIP", description: "Wheel clamps can be removed with a crowbar." },
    { title: "GAMEPLAY TIP", description: "You can use a crowbar to free your friends from a police car." },
    { title: "GAMEPLAY TIP", description: "You can turn off smoke from fires by disabling that option by pressing F1 and going to options." },
    { title: "GAMEPLAY TIP", description: "You can turn off grass sprites by disabling that option by pressing F1 and going to options." },
    { title: "GAMEPLAY TIP", description: "If music is too loud you can press F1 and go to options to lower the volume." },
    { title: "GAMEPLAY TIP", description: "To free someone from zip ties, right click on them with your fists out." },
    { title: "GAMEPLAY TIP", description: "You can get rid of DNA by setting a body on fire using a molotov." },
    { title: "GAMEPLAY TIP", description: "If you kill a person, traces of your DNA are left on the body." },
    { title: "GAMEPLAY TIP", description: "When buying clothes at Lucia's, make sure to ask about Fashion tips." },
    { title: "GAMEPLAY TIP", description: "You can force cuffed people as a Police Officer into a vehicle by taking your fists out and pressing reload on the police vehicle." },
    { title: "GAMEPLAY TIP", description: "You can view the places where you are allowed to mug using the Mugging Map at www.paralakeV6.com/map" },
    { title: "GAMEPLAY TIP", description: "You can use the 'showgps' command in console to have a portable GPS on your screen!" },
    { title: "GAMEPLAY TIP", description: "You can view the base construction rules by reading the handbooklet at https://help.perpheads.com/page/construction-handbook" },
    { title: "GAMEPLAY TIP", description: "TVs not working? Follow this guide at https://help.perpheads.com/page/televisions-html to fix the issue " },
    { title: "GAMEPLAY TIP", description: "You can disable TVs by pressing F1 and go to options." },
    { title: "GAMEPLAY TIP", description: "Make sure to invest in a Car Security, a cheap tool to prevent your car from being stolen." },
    { title: "GAMEPLAY TIP", description: "With the purchase of a new vehicle you are entitled to a free paint job." },
    { title: "GAMEPLAY TIP", description: "As a government employee you can fuel and repair your vehicle for free." },
    { title: "GAMEPLAY TIP", description: "If there is no courier, you can get your package delivered to one of four pick up points around the map." },
    { title: "GAMEPLAY TIP", description: "Blunt melee weapons, such as baseball bats and hammers, can be used to break windows." },
    { title: "GAMEPLAY TIP", description: "To reclaim your stolen planters, speak to the City Hall NPC." },
    { title: "GAMEPLAY TIP", description: "Knives, katanas and machetes can be used to slash tires." },
    { title: "GAMEPLAY TIP", description: "If you speak to an NPC with a visible weapon, police will be alerted and dispatched to your location." },
    { title: "GAMEPLAY TIP", description: "If you are building a shop with a large amount of items, you can ask an administrator for extended props." },
    { title: "GAMEPLAY TIP", description: "You can join our Discord, Steam Group or make a forum's post to recieve rewards https://help.perpheads.com/page/player-rewards " },
    { title: "GAMEPLAY TIP", description: "If you think you've been arrested wrongfully you are entitled to request a Supervisor." },
    { title: "GAMEPLAY TIP", description: "Before you buy materials, look at the Sales Tax, if it's high, you can ask the Mayor to lower it in order to save money." },
    { title: "GAMEPLAY TIP", description: "If you are a candidate for the Mayor, you can advertise using /campaign." },
    { title: "GAMEPLAY TIP", description: "If you have trouble with gambling, you can request to be blacklisted from the Casino." },
    { title: "GAMEPLAY TIP", description: "To avoid breaking the server rules don't kill yourself to evade the police custody." },
    { title: "GAMEPLAY TIP", description: "If your friends are going to jail for seven years or more, you can kill police officers in order to break them out." },
    { title: "GAMEPLAY TIP", description: "Shooting someone in the legs will cripple them and make them an easier target." },
    { title: "GAMEPLAY TIP", description: "When making a report against another player, make sure to provide a detailed description of the incident and, if possible, a video clip of the incident." },
    { title: "GAMEPLAY TIP", description: "Performing your duties as a Firefighter or Paramedic will gain experience. Obtain experience to level up and unlock new equipment and perks. " },
    { title: "GAMEPLAY TIP", description: "Be sure to check out the PERPHeads forums and Discord to keep up-to-date with the latest news and community discussions. " },
    { title: "GAMEPLAY TIP", description: "Hire billboards at the PLN Building" },
    { title: "GAMEPLAY TIP", description: "Place adverts at the PLN Building or PLN News Stand" },
];
shuffle(hints);

const tipTitle = document.getElementById('tip-title');
const tipText = document.getElementById('tip-text');
let currentTip = 0;

function showNextTip() {
    tipText.style.opacity = 0;

    setTimeout(() => {
    tipTitle.textContent = hints[currentTip].title;
    tipText.textContent = hints[currentTip].description;
    currentTip = (currentTip + 1) % hints.length;

    setTimeout(() => {
        tipText.style.opacity = 0.8;
    }, 50);
    }, 500);
}

setTimeout(() => {
    showImage(current);
    setInterval(nextImage, timeBetweenImages);

    showNextTip();
    setInterval(showNextTip, 15000);

    tipTitle.style.opacity = .8;
    mainBackground.style.opacity = 0;
    authorLabel.style.opacity = .3;
    titleBanner.style.opacity= .6;
    logo.style.opacity = .4;
}, 0);
