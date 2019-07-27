pragma solidity ^0.4.19;

/**
 * @dev safe math library
 */
library SafeMath {
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {

    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}


/**
 * @dev ERC20 token interface 
 */
interface ERC20 {
  function balanceOf(address who) external view returns (uint256);
  function transferNew(address from ,address to, uint256 value) external returns (bool);
  function allowance(address owner, address spender) external view returns (uint256);
  function transferFrom(address from, address to, uint256 value) external returns (bool);
  function transfer(address to, uint256 value) external returns (bool);
  function approve(address buyer,address spender, uint256 value) external returns (bool);
  
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract MphasisToken is ERC20 {
    using SafeMath for uint;
    string internal _name;
    string internal _symbol;
    uint8 internal _decimals;
    uint256 internal _totalSupply;
    
    address internal _owner;
    
    mapping (address => uint256) internal balances;
    mapping (address => mapping (address => uint256)) internal allowed;
    
    /**
     * @dev constructor
     */
    constructor(string name, string symbol, uint8 decimals, uint256 totalSupply) payable public {
        _symbol = symbol;
        _name = name;
        _decimals = decimals;
        _totalSupply = totalSupply;
        balances[msg.sender] = totalSupply;
        _owner = msg.sender;
    }

    /**
    * @dev function to initialize MphasisToken
    */
    function init(string name, string symbol, uint8 decimals, uint256 totalSupply) payable public {
		_symbol = symbol;
		_name = name;
		_decimals = decimals;
		_totalSupply = totalSupply;
    	balances[msg.sender] = totalSupply;
    	_owner = msg.sender;
    }
    
    
      /**
     * @dev function to transfer tokens
     */
     function transferNew(address _from,address _to, uint256 _value) payable public returns (bool) {
         require(_to != address(0));
         require(_value <= balances[_from]);
         balances[_from] = SafeMath.sub(balances[_from], _value);
         balances[_to] = SafeMath.add(balances[_to], _value);
         emit Transfer(_from, _to, _value);
         return true;
     }
     
     
     /**
     * @dev function to transfer tokens
     */
     function transfer(address _to, uint256 _value) payable public returns (bool) {
         require(_to != address(0));
         require(_value <= balances[_owner]);
         balances[msg.sender] = SafeMath.sub(balances[_owner], _value);
         balances[_to] = SafeMath.add(balances[_to], _value);
         emit Transfer(_owner, _to, _value);
         return true;
     }
     
     
     
     /**
      * @dev function to check balance
      */
     function balanceOf(address _owner)public view returns (uint256) {
         return balances[_owner];
     }
     
     /**
      * @dev function to approve token 
      */
    function approve(address buyer,address _spender, uint256 _value) public returns (bool) {
     allowed[buyer][_spender] = _value;
     emit Approval(buyer, _spender, _value);
     return true;
    }
     
     /**
      * @dev function to set allowance
      */
     function allowance (address _owner, address _spender) public view returns(uint256) {
         return allowed[_owner][_spender];
     }

    /**
     * @dev function for receiver to transfer tokens
     */
    function transferFrom(address _from, address _to, uint256 _value) payable public returns (bool) {
        require(_to != address(0));
         require(_value <= balances[_from]);
         require(_value <= allowed[_from][_to]);
    
        balances[_from] = SafeMath.sub(balances[_from], _value);
         balances[_to] = SafeMath.add(balances[_to], _value);
         allowed[_from][_to] = SafeMath.sub(allowed[_from][_to], _value);
        emit Transfer(_from, _to, _value);
         return true;
    }

    /**
     * @dev function to increase allowance
     */
    function increaseApproval(address _from,address _spender, uint _addedValue) payable public returns (bool) {
     allowed[_from][_spender] = SafeMath.add(allowed[_from][_spender], _addedValue);
     emit Approval(_from, _spender, allowed[_from][_spender]);
     return true;
    }

    /**
     * 
     * @dev function to decrease allowance
     */
    function decreaseApproval(address _spender, uint _subtractedValue) payable  public returns (bool) {
         uint oldValue = allowed[msg.sender][_spender];
         if (_subtractedValue > oldValue) {
           allowed[msg.sender][_spender] = 0;
         } else {
           allowed[msg.sender][_spender] = SafeMath.sub(oldValue, _subtractedValue);
        }
        emit  Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
         return true;
    }
}