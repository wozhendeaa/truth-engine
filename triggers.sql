
DROP TRIGGER after_comment_insert;

DROP TRIGGER after_reaction_insert;


DELIMITER //
CREATE TRIGGER after_reaction_insert
AFTER INSERT 
ON `reaction` FOR EACH ROW 
BEGIN
    DECLARE recieverId INT;
    DECLARE displayName TEXT;
    DECLARE contentSnippet TEXT;
    
    SELECT  displayname INTO @displayName FROM `user` where id = new.userId;
    if @displayName is null then
    set @displayName = '';
    end if;

    IF NEW.commentID IS NULL THEN
        SELECT authorId, LEFT(p.content, 200) INTO @recieverId, @contentSnippet FROM post as p WHERE id = NEW.postId;
		INSERT INTO notification (`content`, `notificationType`, `receiverId`, `hasRead`, `senderId`, `createdAt`) 
       VALUES(CONCAT(@displayName,' promote_post: "', @contentSnippet, '"'), 'LIKE', @recieverId, false, NEW.userId, NOW());
    ELSE
        SELECT authorId, LEFT(content, 200) INTO @recieverId, @contentSnippet FROM comment WHERE id = NEW.commentID;
        INSERT INTO notification (`content`, `notificationType`, `receiverId`, `hasRead`, `senderId`, `createdAt`) 
        VALUES (CONCAT(@displayName, ' liked_comment: ', @contentSnippet, '"'),  'LIKE', @recieverId, false, NEW.userId, NOW());
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_comment_insert
AFTER INSERT 
ON `comment` FOR EACH ROW 
BEGIN
    DECLARE recieverId INT;
    DECLARE displayName TEXT;
    DECLARE originalComment TEXT;
    SELECT displayname INTO @displayName FROM `user` where id=new.authorId;
    if @displayName is null then
    set @displayName = '';
    end if;
	
    IF NEW.replyToCommentId IS NOT NULL THEN
		SELECT LEFT(content, 200) INTO @originalComment FROM `comment` where id=new.replyToCommentId;
		if @originalComment is null then
		set @originalComment = '';
		end if;
        SELECT authorId INTO @recieverId FROM comment WHERE id = NEW.replyToCommentId;
    ELSE
    	SELECT LEFT(content, 200) INTO @originalComment FROM `post` where id=new.replyToPostId;
		if @originalComment is null then
		set @originalComment = '';
		end if;
        SELECT authorId INTO @recieverId FROM post WHERE id = NEW.replyToPostId;
    END IF;

    INSERT INTO notification (`content`, `notificationType`, `receiverId`, `hasRead`, `senderId`, `createdAt`) 
    VALUES (CONCAT( @displayName, ' replied_comment', @originalComment ), 'comment', @recieverId, false, NEW.authorId, NOW());
END //
DELIMITER ;
