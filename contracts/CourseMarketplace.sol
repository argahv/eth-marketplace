// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketplace {
    enum State {
        Purchased,
        Activated,
        Deactivated
    }

    // mapping of courseHash ot course data
    mapping(bytes32 => Course) private ownedCourses;

    // mapping courseId to courseHash
    mapping(uint256 => bytes32) private ownedCourseHash;

    // number of all courses+id of the course
    uint256 private totalOwnedCourses;

    address payable private owner;

    constructor() {
        setContractOwner(msg.sender);
    }

    /// Course already has an owner
    error CourseHasOwner();

    /// Only owner can call this function
    error OnlyOwner();

    modifier onlyOwner() {
        if (msg.sender != getContractOwner()) {
            revert OnlyOwner();
        }
        _;
    }

    struct Course {
        uint256 id; //32
        uint256 price; //32
        bytes32 proof; //32
        address owner; //20
        State state; //1
    }

    function purchaseCourse(bytes16 _courseId, bytes32 _proof)
        external
        payable
    {
        bytes32 courseHash = keccak256(abi.encodePacked(_courseId, msg.sender));

        if (hasCourseOwnerShip(courseHash)) {
            revert CourseHasOwner();
        }

        uint256 id = totalOwnedCourses++;
        ownedCourseHash[id] = courseHash;

        ownedCourses[courseHash] = Course({
            id: id,
            price: msg.value,
            proof: _proof,
            owner: msg.sender,
            state: State.Purchased
        });
    }

    function transferOwnership(address newOwner) external {
        require(msg.sender == owner, "Only owner can transfer ownership");
        setContractOwner(newOwner);
    }

    function getCourseCount() external view returns (uint256) {
        return totalOwnedCourses;
    }

    function getCourseHashAtIndex(uint256 _index)
        external
        view
        returns (bytes32)
    {
        return ownedCourseHash[_index];
    }

    function getCourseByHash(bytes32 courseHash)
        external
        view
        returns (Course memory)
    {
        return ownedCourses[courseHash];
    }

    function getContractOwner() public view returns (address) {
        return owner;
    }

    function setContractOwner(address newOwner) private {
        owner = payable(newOwner);
    }

    function hasCourseOwnerShip(bytes32 courseHash)
        private
        view
        returns (bool)
    {
        return ownedCourses[courseHash].owner == msg.sender;
    }
}
