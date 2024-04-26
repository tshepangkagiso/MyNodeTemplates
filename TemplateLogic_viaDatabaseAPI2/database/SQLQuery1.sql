CREATE DATABASE BusinessModel
ON PRIMARY (
    NAME = BM_DATAFILE,
    FILENAME = 'C:\BusinessModel\BM_DATAFILE.mdf',
    SIZE = 5MB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 10MB
),
FILEGROUP BM_DATAFILE2 (
    NAME = BM_DATAFILE2,
    FILENAME = 'C:\BusinessModel\BM_DATAFILE2.ndf',
    SIZE = 5MB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 10MB
)
LOG ON (
    NAME = BM_LOGFILE,
    FILENAME = 'C:\BusinessModel\BM_LOGFILE.ldf',
    SIZE = 5MB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 10MB
);

use BusinessModel
go
-- Create UserLogin table
CREATE TABLE UserDetails (
    userID int primary key identity(1,1),
    userName varchar(100) not null,
    userEmail varchar(200) not null unique,
    userRegistrationDate datetime default(getdate()) not null,
	userPassword varchar(1000) not null
);
