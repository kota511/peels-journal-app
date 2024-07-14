const e = require('express');
const sequelize = require('../database');

//prevents cluttering of console logs when testing 
function log_error(message, error) {
    if (process.env.NODE_ENV !== 'test') {
        console.error(message, error);
    }
}

//called whenever an endpoint decides it needs to log user xp 
async function log_xp(xp, userID) {
    try {
        await sequelize.models.XPLog.create({
            xp_change: xp,
            UserUserID: userID
        });
    } catch (error) {
        log_error('Error logging xp:', error);
    }
}

function calculateLevel(experience) {
    let level = 1;
    let xpForNextLevel = 20;

    while (experience >= xpForNextLevel) {
        level++;
        experience -= xpForNextLevel;
        xpForNextLevel += 5; // Increase XP required for the next level
    }

    return level;
}

async function add_xp_to_user(user, xp) {
    const newExperience = user.xp + xp;
    const newLevel = calculateLevel(newExperience);
    await user.update({ xp: newExperience, level: newLevel });
    await log_xp(xp, user.userID);
}

async function grantBadge(user, badgeName) {
    let earnedBadges;
    try {
        // Attempt to parse the existing earnedBadges field
        earnedBadges = JSON.parse(user.earnedBadges || '{}');
    } catch (error) {
        console.error(`Error parsing earnedBadges for user ${user.username}:`, error);
        // Default to an empty array if parsing fails
        earnedBadges = [];
    }

    if (!earnedBadges.includes(badgeName)) {
        earnedBadges.push(badgeName);
        // Make sure to stringify the updated array before saving
        await user.update({ earnedBadges: JSON.stringify(earnedBadges) });
    }
}

const calculateYearsDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInYears = end.getFullYear() - start.getFullYear();
    return differenceInYears;
};

async function updateBadges(user) {
    console.log("Updating badges for user: ", user.username);

    const yearsActive = calculateYearsDifference(user?.registrationDate, new Date());
    console.log(`Years active: ${yearsActive}, Days in a row: ${user.daysInARow}, Entry count: ${user.entryCount}, Level: ${user.level}`);

    // Check and update login streak badges
    if (user.daysInARow >= 365) {
        console.log("Granting oneyearloginstreak badge");
        await grantBadge(user, 'oneyearloginstreak');
    } else if (user.daysInARow >= 180) {
        console.log("Granting sixmonthloginstreak badge");
        await grantBadge(user, 'sixmonthloginstreak');
    } else if (user.daysInARow >= 90) {
        console.log("Granting threemonthloginstreak badge");
        await grantBadge(user, 'threemonthloginstreak');
    } else if (user.daysInARow >= 30) {
        console.log("Granting onemonthloginstreak badge");
        await grantBadge(user, 'onemonthloginstreak');
    } else if (user.daysInARow >= 7) {
        console.log("Granting oneweekloginstreak badge");
        await grantBadge(user, 'oneweekloginstreak');
    } else if (user.daysInARow >= 1) {
        console.log("Granting firstlogin badge");
        await grantBadge(user, 'firstlogin');
    }
    // Check and update entry count badges
    if (user.entryCount >= 100) {
        console.log("Granting hundredentry badge");
        await grantBadge(user, 'hundredentry');
    } else if (user.entryCount >= 50) {
        console.log("Granting fiftyentry badge");
        await grantBadge(user, 'fiftyentry');
    } else if (user.entryCount >= 10) {
        console.log("Granting tenentry badge");
        await grantBadge(user, 'tenentry');
    } else if (user.entryCount >= 1) {
        console.log("Granting firstentry badge");
        await grantBadge(user, 'firstentry');
    }
    // Check and update account level badges
    if (user.level >= 21 && user.level <= 25) {
        console.log("Granting levelV badge");
        await grantBadge(user, 'levelV');
    } else if (user.level >= 16 && user.level <= 20) {
        console.log("Granting leveliv badge");
        await grantBadge(user, 'leveliv');
    } else if (user.level >= 11 && user.level <= 15) {
        console.log("Granting leveliii badge");
        await grantBadge(user, 'leveliii');
    } else if (user.level >= 6 && user.level <= 10) {
        console.log("Granting levelii badge");
        await grantBadge(user, 'levelii');
    } else if (user.level >= 1 && user.level <= 5) {
        console.log("Granting leveli badge");
        await grantBadge(user, 'leveli');
    }
    // Check and update account creation badges
    if (yearsActive >= 5) {
        console.log("Granting fiveYearAcc badge");
        await grantBadge(user, 'fiveyearacc');
    } else if (yearsActive >= 1) {
        console.log("Granting oneYearAcc badge");
        await grantBadge(user, 'oneyearacc');
    } else if (user.registrationDate) {
        console.log("Granting acccreated badge");
        await grantBadge(user, 'acccreated');
    }

    // Check and update entry day streak badges
    if (user.entryDaysInARow >= 365) {
        console.log("Granting oneyearstreak badge");
        await grantBadge(user, 'oneyearstreak');
    } else if (user.entryDaysInARow >= 180) {
        console.log("Granting sixmonthstreak badge");
        await grantBadge(user, 'sixmonthstreak');
    } else if (user.entryDaysInARow >= 90) {
        console.log("Granting threemonthstreak badge");
        await grantBadge(user, 'threemonthstreak');
    } else if (user.entryDaysInARow >= 30) {
        console.log("Granting onemonthstreak badge");
        await grantBadge(user, 'onemonthstreak');
    } else if (user.entryDaysInARow >= 1) {
        console.log("Granting firstentry badge");
        await grantBadge(user, 'firstentry');
    }

    // Check and update every month streak badge
    if (user.monthlyEntryCounter >= 12) {
        console.log("Granting everymonthstreak badge");
        await grantBadge(user, 'everymonthstreak');
    }
}

module.exports = { log_error, log_xp, calculateLevel, add_xp_to_user, updateBadges, grantBadge };