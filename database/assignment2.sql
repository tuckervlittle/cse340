-- QUERY 1:
-- ****************************** --
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password,
)
VALUES (
    'Tony',
    'Stark',
    'tony@starknet.com',
    'Iam1ronM@n'
);


-- QUERY 2:
-- ****************************** --
UPDATE
    public.account 
SET
    account_type = 'Admin' 
WHERE
    account_lastname = 'Stark';


-- QUERY 3:
-- ****************************** --
DELETE FROM
    public.account 
WHERE
    account_lastname = 'Stark';


-- QUERY 4:
-- ****************************** --
UPDATE
    public.inventory
SET
    inv_description = REPLACE (inv_description, 'the small interiors', 'a huge interior')
WHERE
    inv_make = 'GM' AND inv_model = 'Hummer';


-- QUERY 5:
-- ****************************** --
SELECT
    inv_make,
    inv_model
FROM
    public.inventory AS inv
INNER JOIN public.classification AS cla
    ON inv.classification_id = cla.classification_id
WHERE classification_name = 'Sport';


-- QUERY 6:
-- ****************************** --
UPDATE
    public.inventory
set
    inv_image = REPLACE (inv_image, 'images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE (inv_thumbnail, 'images/', 'images/vehicles/');