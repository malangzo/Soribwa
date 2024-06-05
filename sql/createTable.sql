use testdb;
CREATE TABLE cycleData (
    file_uuid VARCHAR(255) NOT NULL,
    user_uuid VARCHAR(255) NOT NULL,
    tsv BLOB NOT NULL,
    PRIMARY KEY (file_uuid)
);