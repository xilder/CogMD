import bcrypt

def hash_password(password: str | bytes) -> bytes:
    """
    Hash a password using bcrypt.
    Args:
        password: The password to hash
    Returns:
        bytes: The hashed password
    """
    if isinstance(password, str):
        password_bytes = password.encode('utf-8')
    else:
        password_bytes = password
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt)

def check_password(password: str, hashed_password: bytes) -> bool:
    """
    Verify if a password matches its hash.
    Args:
        password: The password to check
        hashed_password: The hashed password to check against
    Returns:
        bool: True if password matches, False otherwise
    """
    if isinstance(password, str):
        password_bytes = password.encode('utf-8')
    else:
        password_bytes = password
    return bcrypt.checkpw(password_bytes, hashed_password)