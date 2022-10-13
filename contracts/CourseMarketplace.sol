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

    struct Course {
        uint256 id; //32
        uint256 price; //32
        bytes32 proof; //32
        address owner; //20
        State state; //1
    }

    function purchaseCourse(bytes16 _courseId, bytes21 _proof)
        external
        payable
    {
        bytes32 courseHash = keccak256(abi.encodePacked(_courseId, msg.sender));
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
}
