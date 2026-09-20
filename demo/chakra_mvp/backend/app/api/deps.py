"""
Project CHAKRA: API Dependencies & 5-Tier Operational RBAC Authentication
"""

from typing import Optional, List
from fastapi import Header, HTTPException, status
from app.core.security import AuthUser, UserRole, MOCK_USERS

def get_current_user(
    x_user_role: Optional[str] = Header(default="io_delhi", alias="X-User-Role")
) -> AuthUser:
    """
    Resolves the operational user based on request header or defaults to Delhi Cyber PS IO.
    Supported mock keys: io_delhi, dysp_blr, ncfl_expert, tau_analyst, vasp_binance.
    """
    user = MOCK_USERS.get(x_user_role)
    if not user:
        # Check if role matches by enum name
        for u in MOCK_USERS.values():
            if u.role.value == x_user_role:
                return u
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid operational user role: '{x_user_role}'. Must be one of: {list(MOCK_USERS.keys())}"
        )
    return user

class RoleChecker:
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: AuthUser = Header(default="io_delhi")) -> AuthUser:
        resolved_user = get_current_user(user if isinstance(user, str) else "io_delhi")
        if resolved_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation restricted. Current role '{resolved_user.role.value}' lacks clearance. Required: {[r.value for r in self.allowed_roles]}"
            )
        return resolved_user
