//GLOBAL DICTIONARIES JSON
var DIC_STATE = {};
var DIC_OFFICE = {};
var DIC_PARTY = {};
var DIC_GFXTYPES = {};
var DIC_HTML = {};

//Fill DIC_OFFICE JSON with data:: [Full name, Closing times]
DIC_STATE.US = ["Estados Unidos", "1:00 am"];
DIC_STATE.AL = ["Alabama", "7:00 pm - 8:00 pm"];
DIC_STATE.AK = ["Alaska", "1:00 am"];
DIC_STATE.AZ = ["Arizona", "11:00 pm"];
DIC_STATE.AR = ["Arkansas", "8:30 pm"];
DIC_STATE.CA = ["California", "11:00 pm"];
DIC_STATE.CO = ["Colorado", "9:00 pm"];
DIC_STATE.CT = ["Connecticut", "8:00 pm"];
DIC_STATE.DC = ["Washington D.C.", "8:00 pm"];
DIC_STATE.DE = ["Delaware", "8:00 pm"];
DIC_STATE.FL = ["Florida", "7:00 pm"];
DIC_STATE.GA = ["Georgia", "7:00 pm"];
DIC_STATE.HI = ["Hawai", "11:00 pm"];
DIC_STATE.ID = ["Idaho", "11:00 pm"];
DIC_STATE.IL = ["Illinois", "8:00 pm"];
DIC_STATE.IN = ["Indiana", "6:00 pm - 7:00 pm"];
DIC_STATE.IA = ["Iowa", "10:00 pm"];
DIC_STATE.KS = ["Kansas", "8:00 pm"];
DIC_STATE.KY = ["Kentucky", "6:00 pm"];
DIC_STATE.LA = ["Luisiana", "9:00 pm"];
DIC_STATE.ME = ["Maine", "8:00 pm"];
DIC_STATE.MD = ["Maryland", "8:00 pm"];
DIC_STATE.MA = ["Massachusetts", "8:00 pm"];
DIC_STATE.MI = ["Michigan", "8:00 pm"];
DIC_STATE.MN = ["Minnesota", "9:00 pm"];
DIC_STATE.MS = ["Mississippi", "8:00 pm"];
DIC_STATE.MO = ["Missouri", "8:00 pm"];
DIC_STATE.MT = ["Montana", "10:00 pm"];
DIC_STATE.NE = ["Nebraska", "9:00 pm"];
DIC_STATE.NV = ["Nevada", "10:00 pm"];
DIC_STATE.NH = ["Nueva Hampshire", "7:00 pm - 7:30 pm - 8:00 pm"];
DIC_STATE.NJ = ["Nueva Jersey", "8:00 pm"];
DIC_STATE.NM = ["Nuevo M\xE9xico", "9:00 pm"];
DIC_STATE.NY = ["Nueva York", "9:00 pm"];
DIC_STATE.NC = ["Carolina del Norte", "7:30 pm"];
DIC_STATE.ND = ["Dakota del Norte", "8:00 pm - 9:00 pm"];
DIC_STATE.OH = ["Ohio", "7:30 pm"];
DIC_STATE.OK = ["Oklahoma", "8:00 pm"];
DIC_STATE.OR = ["Oreg\xF3n", "11:00 pm"];
DIC_STATE.PA = ["Pennsylvania", "8:00 pm"];
DIC_STATE.RI = ["Rhode Island", "8:00 pm"];
DIC_STATE.SC = ["Carolina del Sur", "7:00 pm"];
DIC_STATE.SD = ["Dakota del Sur", "9:00 pm"];
DIC_STATE.TN = ["Tennessee", "8:00 pm"];
DIC_STATE.TX = ["Texas", "8:00 pm"];
DIC_STATE.UT = ["Utah", "10:00 pm"];
DIC_STATE.VT = ["Vermont", "7:00 pm"];
DIC_STATE.VA = ["Virginia", "7:00 pm"];
DIC_STATE.WA = ["Washington", "11:00 pm"];
DIC_STATE.WV = ["West Virginia", "7:30 pm"];
DIC_STATE.WI = ["Wisconsin", "9:00 pm"];
DIC_STATE.WY = ["Wyoming", "9:00 pm"];

//Fill DIC_OFFICE JSON with data:: [Full name, List order]
DIC_OFFICE.H = ["House", "4"];
DIC_OFFICE.G = ["Governor", "2"];
DIC_OFFICE.S = ["Senate", "3"];
DIC_OFFICE.I = ["Ballot Initiative", "5"];
DIC_OFFICE.P = ["Presidential", "1"];

//Fill DIC_PARTY JSON with data:: [Party, Party Color]
DIC_PARTY.GOP = ["Rep", "rgb(155, 41, 41)"];
DIC_PARTY.DEM = ["Dem", "rgb(29, 81, 180)"];
DIC_PARTY.IND = ["Ind", "rgb(141, 145, 43)"];
DIC_PARTY.LIB = ["Lib", "rgb(144, 7, 7)"];
DIC_PARTY.GRN = ["Grn", "rgb(43, 131, 63)"];
DIC_PARTY.CST = ["Cst", "rgb(101, 18, 172)"];
DIC_PARTY.NPA = ["Npa", "rgb(108, 42, 173)"];
DIC_PARTY.ADP = ["Adp", "rgb(110, 110, 110)"];
DIC_PARTY.NDP = ["Ndp", "rgb(110, 110, 110)"];
DIC_PARTY.NO = ["", "rgb(110, 110, 110)"];
DIC_PARTY.YES = ["", "rgb(110, 110, 110)"];

//Fill DIC_GFXTYPES JSON with data:: [What will be shown if none of the others are selected, List in drop down....]
DIC_GFXTYPES.P = ['Proyecci\xf3n', 'Side by Side', 'Contienda Re\xf1ida', 'Mapa - Contienda Re\xf1ida'];
DIC_GFXTYPES.I = ['Proyecci\xf3n', 'Side by Side', 'Contienda Re\xf1ida', ];
DIC_GFXTYPES.Default = ['Proyecci\xf3n', 'Side by Side', 'Contienda Re\xf1ida', 'Resultados - Porcentaje', 'Resultados 3'];

//Fill DIC_HTML JSON with data:: [Title name, Title innerHTML, className]
DIC_HTML.title = ["Main", "CPI", "title"];
DIC_HTML.ABC = ["abc", "CPI - Alphabetical", "item0"];
DIC_HTML.H = ["H", "CPI - House", "item1"];
DIC_HTML.G = ["G", "CPI - Governor", "item2"];
DIC_HTML.S = ["S", "CPI - Senate", "item3"];
DIC_HTML.I = ["I", "CPI - Ballot-Inititive", "item4"];
DIC_HTML.P = ["P", "CPI - Presidential", "item5"];
