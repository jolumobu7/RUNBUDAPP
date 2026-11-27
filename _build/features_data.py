# Every feature in RunBud 2.0, grouped. Source of truth: the app's src/lib/features.ts plus team, message and school code.
G = [
 ("train","Train","Plan the day, log it, and time it.",[
  ("today","Today","Today tab","The first screen. Shows today's workout from your coach or your own plan, part by part.",["Warm-up, main set, weight room and cool-down","Log it in one tap when you're done","A week strip to jump between days","Eight shortcuts and See everything in RunBud"]),
  ("runbud-coach","RunBud Coach","Today › Coach","Builds and adjusts a training plan from your marks, history and how you feel. No AI writes the plan.",["Set your event, goal mark, current best and goal meet","Mark each weekday as practice, open or off, with minutes, lift days and fixed sessions","Season phases counted back from your meet, with a lighter week every fourth week","Pace table for your event, a realistic range for your goal, and what changed this week","Adapts to check-ins, missed days and fading splits; never overwrites a session you edited or a coach's workout"]),
  ("plan","Plan your week","Log › Plan","Write your own workouts on any day and repeat a week you like.",["Add parts, planned minutes and planned effort","Copy a week forward"]),
  ("session","Log a session","Today › Log","Record what you did.",["Minutes and effort from 1 to 10","Reps and splits, weight-room sets","Shoes you wore and notes"]),
  ("timer","Rep and lap timer","Today › Timer","Time reps and rest at the track.",["Laps, rep stops and rest timing","Optional rep distance","Saves splits to your log with an effort rating"]),
  ("strength","Strength by event","Learn › Strength by event","Weight-room plans matched to your event group.",[]),
  ("stretch","Stretching","Learn › Stretching","Dynamic warm-ups before training and static stretches after.",[]),
  ("meets","Meets and taper","See everything › Meets and taper","Add meets for a countdown and a taper check on the week before.",[]),
 ]),
 ("recover","Recover","Know how you're doing before you train.",[
  ("checkin","Daily check-in","Today › Check-in","A quick morning check-in.",["Sleep last night and sleep quality","Soreness, energy, stress and mood","Pain (not normal soreness) and where it hurts","Feeling sick: cold, flu or stomach bug","Notes"]),
  ("readiness","Readiness","Insights › Readiness","Green, yellow or red, compared with your own normal.",["Uses sleep, HRV, resting heart rate and training load when available","Shows what to watch today"]),
  ("injuries","Injuries and recovery","Learn › Injuries and recovery","15 common track injuries with self-checks and return-to-running guidance.",[]),
  ("sleep","Sleep calculator","Learn › Sleep","Bedtimes and wake-up times that line up with sleep cycles, plus sleep habits.",[]),
 ]),
 ("fuel","Fuel","Eat and drink for training.",[
  ("hydration","Hydration","Today › Water","A daily target, a tracker and your history.",["Quick add: 8 oz, a bottle or 24 oz, and undo","Electrolyte choices and notes","Seven-day average against your goal"]),
  ("widgets","Hydration widgets","Home screen and Lock Screen","Log water without opening the app, on iPhone and Android.",["Small, medium and Lock Screen sizes on iPhone"]),
  ("fueling","Fuel","Learn › Fuel","Everyday meals, race-day fueling and supplements.",[]),
 ]),
 ("mind","Mind","Train the mental side.",[
  ("mental","Mental training","Learn › Mental training","Meditation, visualization, flow state and pre-race routines.",[]),
 ]),
 ("progress","Progress","See your training add up.",[
  ("insights","Insights and graphs","Today › Insights","Readiness, load, progress and patterns.",["Load with fitness (six weeks), fatigue (one week) and form","Progress on marks, tests and lifts","Sleep and HRV over the last three weeks","Patterns in how you feel"]),
  ("review","Weekly review","Insights › Weekly review","This week next to last week.",[]),
  ("results","Results and PRs","Today › Result","Races, time trials and personal bests, which also set RunBud Coach's paces.",[]),
  ("tests","Tests","See everything › Tests","Flying 30s, jumps and lift tests.",[]),
  ("tables","Tables","Log › Tables","Every number you've logged in sortable tables.",[]),
  ("watch","Watch data","Log › Watch","Reads Apple Health on iPhone and Health Connect on Android.",["Runs and workouts, resting heart rate, HRV, sleep stages, steps, calories and exercise minutes","Garmin, Coros, Strava and Whoop work when they sync to Health","Read only: RunBud never writes to Health","A switch for every metric; watch data is never sent to AI"]),
 ]),
 ("team","Teams","Coaches, staff and the athletes they work with.",[
  ("join","Join or create a team","Team tab","Athletes join with an athlete code. Staff join with a staff code. Anyone can create a team and become its head coach.",["Be on more than one team","Leave a team any time"]),
  ("sharing","Sharing controls","Team › your team › Change what I share","Choose, for coaches, athletic trainers and nutritionists separately, whether they see sessions, results, check-ins and watch data.",[]),
  ("post","Posting workouts","Team › your team › Post a workout","Coaches post by whole team or event group and choose when athletes see it: now, the night before at 8 PM, that morning at 6 AM, or that day at noon.",[]),
  ("roster","Roster and athlete detail","Team › your team","Coaches see each athlete's event, check-in, last session and load, with athletes who need attention first. Open an athlete for their week and load against the last four weeks.",[]),
  ("hub","Coach hub on the web","myrunbud.com/hub.html","The same team on a laptop or iPad: roster, athlete detail, workouts, messages, CSV export and printing.",[]),
  ("selfcoached","I coach myself","Team › I coach myself","Tell RunBud you plan your own training. Turn it off when a coach's plan is your plan.",[]),
  ("goals","Season goals and events","Team › Season goals, Your events","Goal marks next to your bests, and the events and event groups you compete in.",[]),
 ]),
 ("messages","Messages and safety","Built for teams with athletes aged 13 to 17.",[
  ("chats","Team, group and direct chats","Team › your team › Messages","A team chat for everyone, group chats that coaches create, and direct messages between two people on the team.",[]),
  ("safety","Safety rules","Always on","Any chat with a staff member is visible to every staff member. Messages can't be edited or deleted. Photos aren't supported, and phone numbers and emails are blocked.",[]),
  ("report","Report and block","Long-press a message","Report with a reason or block a person. The RunBud team reviews reports within 24 hours.",[]),
 ]),
 ("schools","Schools and administrators","Oversight for athletic directors and school staff.",[
  ("school-create","School accounts","Team › School administrators","Create a school, add administrators with an administrator code, and give coaches a link code to connect their teams.",[]),
  ("school-review","Message review","School view, in the app or on the web","Administrators read every message on linked teams and can hide a message, which stays on record. They can't read athletes' private training logs or health data.",[]),
 ]),
 ("recruiting","Recruiting","For athletes looking at college.",[
  ("guide","Recruiting guide","See everything › Recruiting guide","Timeline, contacting coaches and visits.",[]),
  ("email","Coach email maker","See everything › Coach email maker","Build a recruiting email step by step.",[]),
  ("schools-match","Match schools","See everything › Match schools","Find programs that fit your marks, through Runcruit.",[]),
  ("scholarships","Scholarships","See everything › Scholarships","Athletic, academic and other aid.",[]),
 ]),
 ("community","Community","Ask people who know.",[
  ("forum","Health forum","See everything › Health forum","Ask athletes, athletic trainers and doctors about pain, fueling or training.",["Agree to the community rules before posting","Verified doctors, athletic trainers and dietitians carry a badge","Report posts and block people; the RunBud team reviews reports within 24 hours"]),
 ]),
 ("you","You and settings","Your account, your look, your data.",[
  ("profile","Profile and settings","Profile tab","Name, units, light or dark look, and the tutorial, which you can skip and replay.",[]),
  ("reminders","Reminders","Profile › Reminders","A daily check-in reminder at the time you choose, and optional water reminders late morning and mid-afternoon.",[]),
  ("backup","Backup and restore","Profile › Backup","While you're signed in, your log backs up to your own account. Restore it on a new phone.",[]),
  ("shoes","Shoes","See everything › Shoes","Mileage on each pair and when to replace them.",[]),
  ("shop","Shop","Profile › Shop","Running gear from a coach's store, which helps keep RunBud free.",[]),
  ("delete","Delete your account","Profile › Delete account","Deletes your account, your backup, your team memberships and your forum posts. Also available on the web.",[]),
 ]),
]
