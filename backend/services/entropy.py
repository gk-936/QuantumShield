import hashlib
import random

class DomainEntropy:
    """
    Entropy utility to generate deterministic but domain-specific random numbers.
    Ensures that different domains get different metrics, but the same domain 
    gets consistent results across scans.
    """
    def __init__(self, domain: str):
        # Create a numeric seed from the domain hash
        seed_str = hashlib.sha256(domain.encode()).hexdigest()
        self.seed = int(seed_str[:8], 16)
        self.rng = random.Random(self.seed)

    def get_int(self, min_val: int, max_val: int) -> int:
        """Get a deterministic random integer within range."""
        return self.rng.randint(min_val, max_val)

    def get_float(self, min_val: float, max_val: float) -> float:
        """Get a deterministic random float within range."""
        return self.rng.uniform(min_val, max_val)

    def choice(self, items: list):
        """Pick a deterministic random item from a list."""
        return self.rng.choice(items)

def get_entropy(domain: str) -> DomainEntropy:
    return DomainEntropy(domain)
