const tracksDJs = "https://api-v2.soundcloud.com/playlists/1741782324?representation=full&client_id=GphvSG1RCC7XYa3C6gHQ9mn1yXo5tmIK&app_version=1703156451&app_locale=en"
const tracksProducers = "https://api-v2.soundcloud.com/playlists/1741786809?representation=full&client_id=GphvSG1RCC7XYa3C6gHQ9mn1yXo5tmIK&app_version=1703156451&app_locale=en"

const tracksMore = "https://api-v2.soundcloud.com/tracks?client_id=GphvSG1RCC7XYa3C6gHQ9mn1yXo5tmIK&[object Object]=&app_version=1703156451&app_locale=en"

const femaleDJs = [
    "LU SEAL",
    "Majandra",
    "Dirty Clits",
    "Zelyna je Belle",
    "CAMILLA V",
    "ARYA",
    "KEROSENE",
    "ZAGROZA",
    "RIANA HOLLEY",
    "Scorpia",
    "Nicole Lukiys",
    "Navi",
    "Frïeda",
    "Alicea",
    "Kassita",
    "GI.O",
    "RAXA",
    "Anima",
    "Esther",
    "QUAARTZ",
    "Levora",
    "Anahita",
    "vollaufsusi",
    "SAGEZZA",
    "GeHt STeil",
    "Luli Panasci",
    "Rabella",
    "ANNÅR",
    "HARMONIE",
    "JourneyOfJudi",
    "F.R.A.N.",
    "Joonam",
    "fyschy",
    "Medusa",
    "Zerdazi",
    "The Pick",
    "Marcie",
    "ips",
    "Alemiko",
    "NayaJayan",
    "DjNyxe",
    "Serafina",
    "UMKA BEGOVIC",
    "ALINA VORKO",
    "c`/cle breaker",
    "miss kookie",
    "Ellen Trenn",
    "Jana Nova",
    "Markool",
    "MAVALU",
    "EinfachKalle",
    "5KYY/SKYY",
    "Chiara Fucci",
    "Romina Haverkamp",
    "AZDRA",
    "Calathea",
    "Yung Lucy",
    "elø",
    "Parisha",
    "Jaszaloth",
    "Toxyblue",
    "AstriDakini",
    "Anne-Lu",
    "Mono Fetish",
]

var hardTechOnlyBool = false;
var womenOnlyBool = false;
var modus = "djs" // 0 = djs, 1 = producers, 2 == both

$(document).ready(function () {
    console.log("loading tracks..");
    $('select').val(modus);
    loadTracks();
});


function selectType(select) {
    modus = select.value;
    loadTracks();
}


function getIds() {
    if (modus == "djs") {
        return $.getJSON(tracksDJs).then(function(data) {
            lst = data.tracks;
            lst.forEach(item => {
                item.artist = "DJ";
            });
            return lst;
        });
    }
    else if (modus == "producers") {
        return $.getJSON(tracksProducers).then(function(data) {
            lst = data.tracks;
            lst.forEach(item => {
                item.artist = "Producer";
            });
            return lst;
        });
    }
    else if (modus == "both") {
        return $.getJSON(tracksProducers).then(function(data1) {
            data1.tracks.forEach(item => {
                item.artist = "Producer";
            });
            return $.getJSON(tracksDJs).then(function(data2) {
                data2.tracks.forEach(item => {
                    item.artist = "DJ";
                });
                return data1.tracks.concat(data2.tracks);
            });
        });
    }
}


function getTracks(trackstring) {
    return $.getJSON(tracksMore+"&ids="+trackstring).then(function(data) {
        return data;
    });
}


function hardTechOnly(button) {
    if (button.value == "OFF") {
        button.value = "ON";
        $("#genreButton").html("Click to display all genres");
    } else {
        button.value = "OFF";
        $("#genreButton").html("Click to display only genre: Hard Techno");
    }
    hardTechOnlyBool = !hardTechOnlyBool;
    loadTracks();
}


function womenOnly(button) {
    if (button.value == "OFF") {
        button.value = "ON";
        $("#genderButton").html("Click to display all genders");
    } else {
        button.value = "OFF";
        $("#genderButton").html("Click to display only Women");
    }
    womenOnlyBool = !womenOnlyBool;
    loadTracks();
}


function getTrackData(tracks, track_ids, callback) {
    for (q=0; q < Math.ceil(track_ids.length/50); q++) {
        maxim = (track_ids.length < 50) ? track_ids.length : 50;

        getTracks(arrToString(track_ids.slice(0,maxim))).then(function(allTracks) {
            track_ids = track_ids.slice(maxim,);

            for (w = 0; w < allTracks.length; w++) {
                track = allTracks[w];
                if (tracks[track.publisher_metadata.id].hasOwnProperty('url')) {
                    tracks[track.publisher_metadata.id].comments = track.comment_count;
                } else {
                    tracks[track.publisher_metadata.id] = {"url": track.permalink_url, "name": track.title, "likes": track.likes_count, "streams": track.playback_count, "comments": track.comment_count};
                }
            }
        });
    }
    callback(tracks);
}


function arrToString(lst) {
    res = "";
    for (e = 0; e < lst.length; e++) {
        res = res.concat(lst[e],",");
    }
    return res.slice(0,-1)
}


function dictToList(dct) {
    lst = [];
    for (key in Object.keys(dct)) {
        lst.push(dct[key]);
    }
}


function sortByPoints(a, b) {
    if (a.points == b.points) {
        return 1;
    }
    return b.points - a.points;
}


function getHTML(sortedTracks) {
    tableStr = "";
    femaleRanking = 1;

    for (k = 0; k < sortedTracks.length; k++) {
        track = sortedTracks[k];
        track["ranking"] = k+1;
        if (track.name == "LU SEAL") {
            track["femaleRanking"] = femaleRanking;
            femaleRanking += 1;
            substr = "<tr id='luseal'>";
        }
        else if (track.female) {
            track["femaleRanking"] = femaleRanking;
            femaleRanking += 1;
            substr = "<tr class='female'>";
        } else {
            track["femaleRanking"] = "N/A";
            substr = "<tr class='male'>";
        }
        substr = substr.concat("<td>", track.ranking, "</td>");
        substr = substr.concat("<td>", track.femaleRanking, "</td>");
        substr = substr.concat("<td>", "<a href='", track.url,"'>", track.name, "</a>", "</td>");
        substr = substr.concat("<td>", track.genre, "</td>");
        substr = substr.concat("<td>", track.artist, "</td>");
        substr = substr.concat("<td>", track.points, "</td>");
        substr = substr.concat("<td>", track.streams, "</td>");
        substr = substr.concat("<td>", track.likes, "</td>");
        substr = substr.concat("<td>", track.comments, "</td>");
        substr = substr.concat("</tr>");
        tableStr = tableStr.concat(substr);
    }
    return tableStr;
}


function loadTracks() {
    let tracksArtist = {};
    $('.target').empty();

    getIds().then(function(first_tracks) {
        for (i = 0; i < first_tracks.length; i++) {
            track = first_tracks[i]
            if (track.hasOwnProperty('title')) {
                tracksArtist[track.publisher_metadata.id] = track.artist;
            } else {
                tracksArtist[track.id] = track.artist;
            }
        }

        track_ids = Object.keys(tracksArtist);
        var promises = [];
        const limit = Math.ceil(track_ids.length/50);
        for (j=0; j < limit; j++) {
            maxim = (track_ids.length < 50) ? track_ids.length : 50;
            promises.push($.getJSON(tracksMore+"&ids="+arrToString(track_ids.slice(0,maxim))));
            track_ids = track_ids.slice(maxim,);
        }

        $.when.apply($, promises).then(function() {
            tracks = [];
            for(var m = 0; m < arguments.length; m++){
                for(l = 0; l < arguments[m][0].length; l++) {
                    track = arguments[m][0][l];
                    female = femaleDJs.includes(track.title);
                    if ((hardTechOnlyBool && track.genre=="Hard Techno") || !hardTechOnlyBool) {
                        if ((womenOnlyBool && female) || !womenOnlyBool) {
                            tracks.push({
                                "url": track.permalink_url,
                                "name": track.title,
                                "genre": track.genre,
                                "artist": tracksArtist[track.id],
                                "likes": track.likes_count,
                                "streams": track.playback_count,
                                "comments": track.comment_count,
                                "points": track.playback_count + (3*track.likes_count) + (5*track.comment_count),
                                "female": female,
                            });
                        }
                    }
                }
            }

            tracks.sort(sortByPoints);
            tableStr = getHTML(tracks);

            $('.target').append(tableStr);
        });
    });
    
}
