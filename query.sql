CREATE  TABLE user( 
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(20) UNIQUE,
    phoneNumber VARCHAR(11),
    password VARCHAR(255));



CREATE TABLE Post(
   id INT PRIMARY KEY AUTO_INCREMENT,
   content VARCHAR(255),
   noOfLikes int,
   noOfComments int,
   noOfShares int,
   userID INT,
   FOREIGN KEY (userID) REFERENCES user(id) ON DELETE CASCADE);

CREATE TABLE commets(
    id INT PRIMARY KEY AUTO_INCREMENT,
    data VARCHAR(50),
    userID INT,
    postID INT,
    FOREIGN KEY(postID) REFERENCES Post(id) ON DELETE CASCADE,
    FOREIGN KEY(userID) REFERENCES user(id) ON DELETE CASCADE)

CREATE TABLE Likes(
    id INT PRIMARY KEY AUTO_INCREMENT,
     userID INT,
    postID INT,
    FOREIGN KEY(postID) REFERENCES Post(id) ON DELETE CASCADE,
    FOREIGN KEY(userID) REFERENCES user(id) ON DELETE CASCADE);

CREATE TABLE Engagement(
     id INT PRIMARY KEY AUTO_INCREMENT,
     engagemrntType VARCHAR(20),
     userID1 INT,
     userID2 INT,
     CHECK(engagemrntType in ("Follower","Following")),
     FOREIGN KEY(userID1) REFERENCES user(id) ON DELETE CASCADE,
     FOREIGN KEY(userID2) REFERENCES user(id) ON DELETE CASCADE);

CREATE TABLE Profile(
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullName VARCHAR(20),
    profilePicture VARCHAR(255),
    gender VARCHAR(10) NOT NULL,
    DOB date,
    previledgeType VARCHAR(10),
     userID INT UNIQUE,
    cHECK(previledgeType in ("Admin","User")),
    CHECK(gender IN ('male','female')),
    FOREIGN KEY(userID) REFERENCES user(id) ON DELETE CASCADE);

CREATE TABLE chats(
     id INT PRIMARY KEY AUTO_INCREMENT,
     timeOfChat TIMESTAMP,
     content VARCHAR(255),
     userID1 INT,
     userID2 INT,
     FOREIGN KEY(userID1) REFERENCES user(id) ON DELETE CASCADE,
     FOREIGN KEY(userID2) REFERENCES user(id) ON DELETE CASCADE);

CREATE TABLE Food(
    id INT PRIMARY KEY AUTO_INCREMENT,
    foodPics VARCHAR(50),
    foodName VARCHAR(20),
    price INT,
    qty INT);

CREATE TABLE Cart(
    id INT PRIMARY KEY AUTO_INCREMENT,
    price int,
    qty int,
    foodID INT,
    userID INT,
    FOREIGN KEY(foodID) REFERENCES Food(id) ON DELETE CASCADE,
    FOREIGN KEY(userID) REFERENCES user(id) ON DELETE CASCADE);

CREATE TABLE boughtFood(
    id INT PRIMARY KEY AUTO_INCREMENT,
    datebought date,
    Ammount int,
    qty int,
    unitprice INT
);