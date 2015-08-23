/* List of different unit types with their stats
 * to add a new unit add a comma to the current last item, then add this template statline:
 * 
    {name:"littleBug",  health:100, speed:1, size:10, armour:0, attack:10, range:10, cooldown:10, store:10, cost:10, legPairs:2, shape:"square"}
 * 
 */
var unitTypes = [
    {name:"Swarmlord",  species:"bug",  health:400, speed:6, size:48, armour:2, attack:40, range:50, cooldown:30, store:100, cost:110,legPairs:3, shape:"wide", builder:"all"},
//  {name:"Freighter",  species:"bug",health:200, speed:6, size:16, armour:1, attack:10, range:10, cooldown:50, store:200, cost:20, legPairs:4, shape:"long"},
    {name:"Scout",      species:"bug",health:100, speed:10,size:8,  armour:0, attack:10, range:10, cooldown:40, store:10,  cost:20, legPairs:1, shape:"square"},
    {name:"Worker",     species:"bug",health:300, speed:4, size:32, armour:2, attack:20, range:10, cooldown:30, store:100, cost:30, legPairs:4, shape:"wide"},
    {name:"Striker",    species:"bug",health:300, speed:8, size:16, armour:1, attack:20, range:20, cooldown:20, store:10,  cost:20, legPairs:2, shape:"rectangle"},
    
    {name:"Lobber",     species:"bug",  health:200, speed:2, size:32, armour:0, attack:40, range:150,cooldown:50, store:20,  cost:40, legPairs:1, shape:"long"},
    {name:"Bastion",    species:"bug",  health:400, speed:4, size:32, armour:4, attack:30, range:10, cooldown:50, store:30,  cost:30, legPairs:2, shape:"square"},
    {name:"Mite",       species:"bug",  health:100, speed:6, size:8,  armour:1, attack:10, range:20, cooldown:20, store:10,  cost:10, legPairs:3, shape:"wide"},
    {name:"Spitter",    species:"bug",  health:300, speed:6, size:16, armour:2, attack:10, range:50, cooldown:10, store:30,  cost:30, legPairs:3, shape:"rectangle"},
    {name:"Zapper",     species:"bug",  health:300, speed:4, size:32, armour:1, attack:40, range:100,cooldown:40, store:30,  cost:30, legPairs:2, shape:"wide"},
    
//  {name:"Bombie",     species:"bug",  health:100, speed:8, size:16, armour:0, attack:50, range:10, cooldown:50, store:10,  cost:10, legPairs:2, shape:"square"},
    {name:"Terrask",    species:"bug",  health:500, speed:6, size:64, armour:3, attack:50, range:100,cooldown:30, store:100, cost:50, legPairs:0, shape:"long"},
    {name:"maker",      species:"bug",  health:100, speed:6, size:8,  armour:0, attack:20, range:50, cooldown:20, store:20,  cost:20, legPairs:4, shape:"rectangle", builder:"self"}
    
    
];

