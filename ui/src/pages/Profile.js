import React, { useEffect, useState } from 'react';
import { FaFire } from 'react-icons/fa';
import { useAuth, updateUser } from '../context/AuthContext';
import '../styles/pages/Profile.css';
// Level badges
import leveli from '../styles/badges/leveli.png';
import levelii from '../styles/badges/levelii.png';
import leveliii from '../styles/badges/leveliii.png';
import leveliv from '../styles/badges/leveliv.png';
import levelv from '../styles/badges/levelv.png';
// Account badges
import acccreated from '../styles/badges/acccreated.png';
import oneyearacc from '../styles/badges/oneyearacc.png';
import fiveyearacc from '../styles/badges/fiveyearacc.png';
// Entry time badges
import morning from '../styles/badges/morning.png';
import night from '../styles/badges/night.png';
import firstday from '../styles/badges/firstday.png';
// Entry day streak badges
import firstentry from '../styles/badges/firstentry.png';
import onemonthstreak from '../styles/badges/onemstreak.png';
import threemonthstreak from '../styles/badges/threemstreak.png';
import sixmonthstreak from '../styles/badges/sixmstreak.png';
import oneyearstreak from '../styles/badges/oneyearstreak.png';
import everymonthstreak from '../styles/badges/everymonthstreak.png';
// Login streak badges
import firstlogin from '../styles/badges/firstlogin.png';
import oneweekloginstreak from '../styles/badges/oneweekloginstreak.png';
import onemonthloginstreak from '../styles/badges/onemloginstreak.png';
import threemonthloginstreak from '../styles/badges/threemloginstreak.png';
import sixmonthloginstreak from '../styles/badges/sixmloginstreak.png';
import oneyearloginstreak from '../styles/badges/oneyearloginstreak.png';
// Entry count badges
import tenentry from '../styles/badges/tenentry.png';
import fiftyentry from '../styles/badges/fiftyentry.png';
import hundredentry from '../styles/badges/hundredentry.png';

import { Get, Post } from 'src/lib/api';

const badges = {
    leveli,
    levelii,
    leveliii,
    leveliv,
    levelv,
    acccreated,
    oneyearacc,
    fiveyearacc,
    morning,
    night,
    firstday,
    firstentry,
    onemonthstreak,
    threemonthstreak,
    sixmonthstreak,
    oneyearstreak,
    everymonthstreak,
    firstlogin,
    oneweekloginstreak,
    onemonthloginstreak,
    threemonthloginstreak,
    sixmonthloginstreak,
    oneyearloginstreak,
    tenentry,
    fiftyentry,
    hundredentry,
};

const Profile = () => {

    const { user, updateUser } = useAuth();
    const [userCharacters, setUserCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [isFavouriteBadge, setIsFavouriteBadge] = useState(false);
    const [isBadgeEarned, setIsBadgeEarned] = useState(false);
    const [newFavBadge, setNewFavBadge] = useState(null);

    useEffect(() => {
        const getCharacters = async () => {
            try {
                setNewFavBadge(user.favBadge);
                const response = await Get('users/characters', { userId: user.userID }, { user: user });

                if (response.ok) {
                    const characters = await response.json();
                    console.log(characters);
                    setUserCharacters(characters[0].Characters);
                } else {
                    console.log(response);

                }
            } catch (error) {
                console.error('Failed to get user characters:', error);
            }
        }
        getCharacters();
    }, [user]);


    const openCharacterModal = (character) => {
        setSelectedCharacter(character);
        setIsCharacterModalOpen(true);
    };

    const updateFavouriteCharacter = async (character) => {
        try {
            // Assuming there's an API endpoint to update the favorite character
            const response = await Post('users/updateFavCharacter', {favCharacter: character }, null, { user: user });

            if (response.ok) {
                // Update local user state with new favorite character
                updateUser({ favPfp: character });
                // Close the modal
                setIsCharacterModalOpen(false);
            } else {
                throw new Error('Failed to update favorite character');
            }
        } catch (error) {
            console.error('Failed to update favorite character:', error);
            alert(error.message);
        }
    };

    // Character detail and selection modal
    const CharacterModal = ({ isOpen, character, onClose }) => {
        if (!isOpen || !character) return null;

        const handleSetFavorite = () => {
            updateFavouriteCharacter(character.description); // Update favorite character
            onClose(); // Close the modal
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>{character.name}</h2>
                    <img src={character.description} alt={character.name} />
                    <div className="modal-buttons">
                        <button onClick={handleSetFavorite} className="button-set-favourite">
                            Set as Favourite
                        </button>
                        <button onClick={onClose} className="button-cancel">Close</button>
                    </div>
                </div>
            </div>
        );
    };
    const renderUserCharacters = () => (
        <div>
            <h3>Your Characters</h3>
            <ul className="item-list">
                {userCharacters.map((character) => (
                    <li key={character.characterID}>
                        <div key={character.characterID} onClick={() => openCharacterModal(character)} style={{cursor: 'pointer'}}>
                            <img src={character.description} alt={character.name} style={{width: '100px', height: '100px'}} />
                        </div>
                    </li>
                ))}
            </ul>
            <CharacterModal
                isOpen={isCharacterModalOpen}
                character={selectedCharacter}
                onClose={() => setIsCharacterModalOpen(false)}
            />
        </div>
    );

    const hasBadge = (badgeName) => {
        return user?.earnedBadges?.includes(badgeName);
    };

    const earnedBadges = Object.keys(badges).filter(badgeName => hasBadge(badgeName));
    const unearnedBadges = Object.keys(badges).filter(badgeName => !hasBadge(badgeName));

    const updateFavouriteBadge = async (badgeName) => {
        const newFavBadgeValue = badgeName === user.favBadge ? null : badgeName;
        try {
            const response = await Post('users/updateFavBadge', { uid: user.uid, favBadge: badges[newFavBadgeValue] || null }, null, { user: user });
    
            if (response.ok) {
                updateUser({ favBadge: newFavBadgeValue });
                setNewFavBadge(newFavBadgeValue);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update favourite badge');
            }
        } catch (error) {
            console.error('Failed to update favourite badge:', error);
            alert(error.message);
        }
    };

    const openBadgeModal = (badgeName, earned) => {
        setSelectedBadge(badgeName);
        setIsFavouriteBadge(user.favBadge === badgeName);
        setIsModalOpen(true);
        setIsBadgeEarned(earned);
    };

    const closeBadgeModal = () => {
        setIsModalOpen(false);
        setSelectedBadge(null);
        setIsFavouriteBadge(false);
    };

    function BadgeModal({ isOpen, badgeName, onClose, isFavouriteBadge, isEarned }) {
        if (!isOpen) return null;

        const handleFavouriteClick = () => {
            if (isFavouriteBadge) {
                updateFavouriteBadge(null);
            } else {
                updateFavouriteBadge(badgeName);
            }
            onClose();
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Badge Detail</h2>
                    <img src={badges[badgeName]} alt={`${badgeName} Badge`} className="modal-badge" />
                    <div className="modal-buttons">
                        <button onClick={onClose} className="button-cancel">Close</button>
                        {isEarned ? (
                            <button onClick={handleFavouriteClick} className={isFavouriteBadge ? "button-unselect-favourite" : "button-set-favourite"}>
                                {isFavouriteBadge ? 'Unselect as Favourite' : 'Set as Favourite'}
                            </button>
                        ) : (
                            <button disabled className="button-locked">Locked</button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    const renderBadges = (badgeNames, earned = true) => {
        return badgeNames.map((badgeName) => (
            <li key={badgeName} onClick={() => openBadgeModal(badgeName, earned)}>
                <img
                    src={badges[badgeName]}
                    alt={`${badgeName} Badge`}
                    className={earned ? '' : 'unearned'}
                />
            </li>
        ));
    };

    const renderAchievements = () => {
        return (
            <div className="achievements">
                <h3>Achievements</h3>
                <ul className="item-list">
                    {renderBadges(earnedBadges)}
                    {renderBadges(unearnedBadges, false)}
                </ul>
            </div>
        );
    }; 
    return (
        <div className="content profile-content">
            <div className="page-header" style={{ fontSize: '30px', fontWeight: 'Bold' }}>
                <h1>Profile</h1>
            </div>
            <h2>Welcome to your Profile, {user?.username}</h2>
            <div className="profile-detail"><strong>Email:</strong> {user?.email}</div>
            <div className="profile-detail"><strong>Username:</strong> {user?.username}</div>
            <div className="profile-detail"><strong>Registration Date:</strong> {user?.registrationDate}</div>
            <div className="profile-detail"><FaFire className="flame-icon" /><strong>Log-in Streak:</strong> {user?.daysInARow}</div>
            <div className="profile-detail"><strong>Level:</strong> {user?.level}</div>
            <div className="profile-detail"><strong>Experience:</strong> {user?.xp}</div>
            <div className="profile-detail"><strong>Entry Count:</strong> {user?.entryCount}</div>
            <div className="profile-detail"><strong>Favourite Badge:</strong> {newFavBadge ? (
                <img
                    src={badges[newFavBadge]}
                    alt="Favourite Badge"
                    className="fav-badge-icon"
                />
            ) : (
                <span>No favourite badge selected</span>
            )}</div>
            <div className="profile-detail"><strong>Current Profile Picture:</strong>
                <img 
                    src={user.favPfp}
                    alt="Profile Picture"
                    className="fav-badge-icon"
                />
            </div>
            <div className="profile-detail">
                <strong>Number of Characters:</strong> {1}
            </div>
            {renderUserCharacters()}
            {renderAchievements()}
            <BadgeModal
                isOpen={isModalOpen}
                badgeName={selectedBadge}
                onClose={closeBadgeModal}
                isFavouriteBadge={isFavouriteBadge}
                isEarned={isBadgeEarned}
            />
            <CharacterModal
                isOpen={isCharacterModalOpen}
                character={selectedCharacter}
                onClose={() => setIsCharacterModalOpen(false)}
            />
        </div>
    );
}

export default Profile;