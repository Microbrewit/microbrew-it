CREATE TYPE country_code AS ENUM (
'AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 
'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 
'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 
'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC',
'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ',
'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK',
'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 
'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 
'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 
'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW',
'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 
'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 
'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 
'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 
'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 
'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 
'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 
'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 
'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 
'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 
'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW'
);

CREATE TABLE address (
       address_id integer SERIAL PRIMARY KEY,
       street text NOT NULL,
       nb integer NOT NULL,
       postnb integer NOT NULL,
       country country_code NOT NULL
);

CREATE TABLE beer_type (
       type_id integer SERIAL PRIMARY KEY,
       type_name text NOT NULL,
       description text NOT NULL,
       origin text NOT NULL
);

CREATE TABLE beer (
       beer_id integer SERIAL PRIMARY KEY,
       beer_name text NOT NULL,
       brewed_by integer REFERENCES brewery (brewery_id),
       alcohol numeric NOT NULL,
       aroma text NOT NULL,
       colour text NOT NULL,
       bitterness text NOT NULL,
       picture bytea   
);

CREATE TABLE beer_has_type (
       beer_id REFERENCES beer (beer_id),
       beer_type_id REFERENCES beer_type (type_id),
       PRIMARY KEY (beer_id, beer_type_id)
);

CREATE TABLE beer_user (
       user_id integer SERIAL PRIMARY KEY,
       username text NOT NULL,
       passwd text NOT NULL,
       email text NOT NULL UNIQUE
);

CREATE TABLE beer_comment (
       user_id integer REFERENCES beer_user (user_id),
       beer_id integer REFERENCES beer (beer_id),
       user_comment integer NOT NULL,
       commented timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
       grade integer NOT NULL CHECK (grade >= 0 AND grade <= 5),
       PRIMARY KEY (user_id, beer_id)
);

CREATE TABLE barcode (
       barcode text PRIMARY KEY,
       beer_id integer REFERENCES beer (beer_id)       
);

CREATE TABLE brewery (
       brewery_id integer SERIAL PRIMARY KEY,
       brewery_name text NOT NULL,
       description text NOT NULL,
       logo bytea NOT NULL,
       address integer REFERENCES address (adress_id)
);

CREATE TABLE brewery_comment (
       user_id integer REFERENCES beer_user (user_id),
       brewery_id integer REFERENCES brewery (brewery_id),
       user_comment text NOT NULL DEFAULT CURRENT_TIMESTAMP,
       grade grade NOT NULL,
       PRIMARY KEY (user_id, brewery_id)
);

CREATE TABLE venue (
       venue_id integer SERIAL PRIMARY KEY,
       venue_name integer NOT NULL,
       venue_type text NOT NULL,
       address REFERENCES  address (address_id)
);

CREATE TABLE bought_at (
       beer_id REFERENCES beer (beer_id),
       venue_id REFERENCES venue (venue_id),
       price money NOT NULL CHECK (price > 0),
       at_date date NOT NULL
);

CREATE FUNCTION beer_avg_grade()
RETURNS numeric AS
$BODY$
        SELECT avg(grade) FROM beer_comment;
$BODY$
LANGUAGE 'sql';

CREATE FUNCTION brewery_avg_grade()
RETURNS numeric AS
$BODY$
        SELECT avg(grade) FROM brewery_comment;
$BODY$
LANGUAGE 'sql';
